import JSZip from 'jszip';
import mime from 'mime-types';

export async function readFile(file: File): Promise<ParsedZip> {
  const zip = await JSZip.loadAsync(file);
  return parseZip(zip);
}

interface ParsedZip {
  data: { id: string; data: { id: string; kw: string[] } }[];
  symbols: { id: string; type: string; data: ArrayBuffer }[];
}

async function parseZip(zip: JSZip): Promise<ParsedZip> {
  const startTime = performance.now();

  return new Promise(resolve => {
    const parsedZip: ParsedZip = {
      data: [],
      symbols: [],
    };

    let counter = 0;

    zip.forEach(async (relativePath, file) => {
      if (file.dir) return;
      counter++;
      const regex = /[^\\/]+?(?=\.\w+$)/;

      const match = file.name.match(regex);
      const id = match ? match[0] : '';
      const mediatype = mime.lookup(file.name);
      let data = null;

      if (id && mediatype && mediatype.includes('image')) {
        data = await file.async('arraybuffer');
        parsedZip.symbols.push({ id, type: mediatype, data });
      }

      if (mediatype && mediatype.includes('json')) {
        const dataString = await file.async('text');
        const data = JSON.parse(dataString).map(
          (item: { id: string; kw: string[] }) => {
            return {
              ...item,
              kw: item.kw.map((kw: string | undefined) =>
                kw ? kw.trim().toLowerCase() : '',
              ),
            };
          },
        );

        parsedZip.data.push({
          data,
          id,
        });
      }

      if (!--counter) {
        const endTime = performance.now();
        console.log('parseZip :>> ', endTime - startTime);
        console.log('parsedZip :>> ', parsedZip);
        resolve(parsedZip);
      }
    });
  });
}
