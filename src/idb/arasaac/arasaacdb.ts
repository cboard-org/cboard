import { DBSchema, IDBPDatabase } from 'idb';
import { openDB } from 'idb/with-async-ittr.js';

export interface Image {
  id: string;
  type: string;
  data: ArrayBuffer;
}

export interface Text {
  imageId: string;
  keywords: string[];
}

interface ArasaacDB extends DBSchema {
  text: {
    key: string;
    value: Text;
    indexes: {
      by_keyword: string;
    };
  };
  images: {
    key: string;
    value: Image;
  };
  keywords: {
    key: string;
    value: { langCode: string; data: Text[] };
  };
}

const DB_NAME = 'arasaac';
const DB_VERSION = 1;

const dbPromise = openDB<ArasaacDB>(DB_NAME, DB_VERSION, {
  upgrade(db: IDBPDatabase<ArasaacDB>): void {
    db.createObjectStore('images', { keyPath: 'id' });
    db.createObjectStore('keywords', { keyPath: 'langCode' });

    const textStore = db.createObjectStore('text', { keyPath: 'imageId' });
    textStore.createIndex('by_keyword', 'keywords', { multiEntry: true });
  },
});

async function getAllImages(): Promise<Image[]> {
  const db = await dbPromise;
  return db.getAll('images');
}

async function getImageById(id: string): Promise<Image | undefined> {
  const db = await dbPromise;
  return db.get('images', id);
}

async function addImage(symbol: Image): Promise<string> {
  const db = await dbPromise;
  return db.add('images', symbol);
}

async function addText(langCode: string, text: Text): Promise<string> {
  const db = await dbPromise;
  return db.add('text', text, langCode);
}

async function addKeyword(langCode: string, keywords: Text[]): Promise<string> {
  const db = await dbPromise;
  return db.add('keywords', { langCode, data: keywords });
}

async function getImagesByKeyword(
  keyword: string,
): Promise<
  ({
    id: string;
    label: string | undefined;
    src: unknown;
  } | null)[]
> {
  const db = await dbPromise;
  const lowerCaseKeyword = keyword.toLowerCase();

  const textByKeyword = keyword
    ? await db.getAllFromIndex('text', 'by_keyword', lowerCaseKeyword)
    : [];

  const imagesIds = textByKeyword
    .map(str => str.imageId.toString())
    .filter(Boolean);

  const images = await Promise.all(
    imagesIds.map(async id => {
      const image = await db.get('images', id);
      const text = await db.get('text', id);

      if (image && text) {
        const blob = new Blob([image.data], { type: image.type });
        const src = await blobToBase64(blob);
        return {
          id: image.id,
          label: text.keywords.find(kw => kw.includes(lowerCaseKeyword)),
          src,
        };
      }

      return null;
    }),
  );

  return images.filter(Boolean);
}

async function getTextByLangCode(langCode: string): Promise<Text | undefined> {
  const db = await dbPromise;
  return db.get('text', langCode);
}

async function importContent({
  symbols,
  data,
}: {
  symbols?: { id: string; type: string; data: ArrayBuffer }[];
  data?: { id: string; data: { id: string; kw: string[] }[] }[];
}): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction(['images', 'text', 'keywords'], 'readwrite');

  const symbolsStore = await tx.objectStore('images');
  const keywordsStore = await tx.objectStore('keywords');

  if (symbols) {
    symbols.forEach((symbol: Image) => {
      symbolsStore.add(symbol);
    });
  }

  if (data) {
    data.forEach(strings => {
      const mappedData = strings.data.map(({ id, kw }) => ({
        imageId: id.toString(),
        keywords: kw,
      }));

      keywordsStore.add({ langCode: strings.id, data: mappedData });
    });
  }

  await tx.done;
}

async function initTextStore(lang: string): Promise<void> {
  console.log('initTextStore(): started');

  const db = await dbPromise;
  const tx = db.transaction(['text', 'keywords'], 'readwrite');

  const keywordsStore = await tx.objectStore('keywords');
  const textStore = await tx.objectStore('text');

  const text = await keywordsStore.get(lang);
  if (text) {
    text.data.forEach(data => {
      const keywords = data.keywords
        .map(keyword => [keyword, ...keyword.split(' ')])
        .flat();
      textStore.put({ ...data, keywords: keywords });
    });
  } else {
    const defaultLang = 'en';
    const defaultText = await keywordsStore.get(defaultLang);

    if (defaultText) {
      defaultText.data.forEach(data => {
        textStore.put(data);
      });
    }
  }

  await tx.done;
  console.log('initTextStore(): completed');
}

async function getImagesText(
  text: string,
): Promise<
  {
    blob: Blob;
    id: string;
    keywords: string[];
  }[]
> {
  const db = await dbPromise;
  const tx = db.transaction(['text', 'images'], 'readonly');
  const imageStore = await tx.objectStore('images');
  let cursor = await tx
    .objectStore('text')
    .index('by_keyword')
    .openCursor();
  const result = [];
  while (cursor) {
    const includesText = cursor.value.keywords.includes(text);

    if (includesText) {
      const image = await imageStore.get(cursor.value.imageId.toString());
      const blob = image ? new Blob([image.data], { type: image.type }) : null;
      if (blob) {
        result.push({
          blob,
          id: cursor.value.imageId,
          keywords: cursor.value.keywords,
        });
      }
    }
    cursor = await cursor.continue();
  }
  return result;
}

const arasaacDB = {
  addImage,
  addKeyword,
  addText,
  getAllImages,
  getImageById,
  getImagesByKeyword,
  getImagesText,
  getTextByLangCode,
  importContent,
  initTextStore,
};

export const getArasaacDB = () => arasaacDB;

const blobToBase64 = (blob: Blob): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
