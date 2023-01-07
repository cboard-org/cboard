import { openDB, DBSchema, StoreNames } from 'idb';

// TODO: better name
export interface Symbol {
  id: string;
  type: string;
  data: ArrayBuffer;
}

// TODO: better name
export interface Strings {
  symbolId: string;
  keywords: string[];
}

interface ArasaacDB extends DBSchema {
  strings: {
    key: string;
    value: Strings;
    indexes: {
      by_keyword: string;
    };
  };
  symbols: {
    key: string;
    value: Symbol;
  };
}

type DBStoreName = StoreNames<ArasaacDB>;

const DB_NAME = 'arasaac';
const DB_VERSION = 1;

const dbPromise = openDB<ArasaacDB>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore('symbols', { keyPath: 'id' });

    const stringsStore = db.createObjectStore('strings');
    stringsStore.createIndex('by_keyword', 'keywords', { multiEntry: true });
  }
});

async function getAllSymbols() {
  const db = await dbPromise;
  return db.getAll('symbols');
}

async function getSymbolById(id: string) {
  const db = await dbPromise;
  return db.get('symbols', id);
}

async function addSymbol(symbol: Symbol) {
  const db = await dbPromise;
  return db.add('symbols', symbol);
}

async function addStrings(langCode: string, strings: Strings) {
  const db = await dbPromise;
  return db.add('strings', strings, langCode);
}

async function getSymbolsByKeyword(keyword: string) {
  const db = await dbPromise;
  const strings = await db.getAllFromIndex('strings', 'by_keyword', keyword);
  const symbolsIds = strings.map(str => str.symbolId?.toString());
  
  const symbols = await Promise.all(
    symbolsIds.map(async (id) => {
      const symbol = await db.get('symbols', id);
      
      if (symbol) {
        const blob = new Blob([symbol.data], { type: symbol.type })
        return blob
      }
    })
  );

  return symbols.filter(Boolean);
}

async function getStringsByLangCode(langCode: string) {
  const db = await dbPromise;
  return db.get('strings', langCode);
}

async function importContent({
  symbols,
  data
}: {
  symbols?: { id: string; type: string; data: ArrayBuffer }[];
  data?: { id: string; data: { id: string; kw: string[] }[] }[];
}) {
  const db = await dbPromise;
  const tx = db.transaction(['symbols', 'strings'], 'readwrite');

  const symbolsStore = await tx.objectStore('symbols');
  const stringsStore = await tx.objectStore('strings');

  if (symbols) {
    symbols.forEach((symbol: Symbol) => {
      symbolsStore.add(symbol);
    });
  }

  if (data) {
    data.forEach(strings => {
      // TODO: remove this hardcoded value
      if (strings.id === 'en') {
        strings.data.forEach(string => {
          stringsStore.add(
            { symbolId: string.id, keywords: string.kw },
            string.id
          );
        });
      }
    });
  }

  await tx.done;
}

const arasaacDB = {
  addSymbol,
  addStrings,
  getAllSymbols,
  getStringsByLangCode,
  getSymbolById,
  getSymbolsByKeyword,
  importContent
};

export const getArasaacDB = () => arasaacDB;
