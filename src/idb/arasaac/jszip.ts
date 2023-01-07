import JSZip from 'jszip';
import mime from 'mime-types';

export async function readFile(file: File) {
  const zip = await JSZip.loadAsync(file);
  return parseZip(zip);
}

async function parseZip(zip: JSZip) {
  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    const parsedZip: any = {
      symbols: [],
      data: []
    };

    let counter = 0;

    zip.forEach(async (relativePath, file) => {
      if (file.dir) return;
      counter++;
      const regex = /[^\\/]+?(?=\.\w+$)/;
      
      const id = file.name.match(regex)?.[0];
      const mediatype = mime.lookup(file.name);
      let data = null;

      if (id && mediatype && mediatype.includes('image')) {
        data = await file.async('arraybuffer');
        parsedZip.symbols.push({ id, type: mediatype, data });
      }

      if (mediatype && mediatype.includes('json')) {
        data = await file.async('text');

        parsedZip.data.push({
          id,
          data: JSON.parse(data)
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
