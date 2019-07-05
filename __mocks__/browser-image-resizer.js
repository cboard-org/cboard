export default function readAndCompressImage(file, userConfig) {
  return new Promise((resolve, reject) => {
    if (file === 'error') {
      reject(new Error({ message: 'not found' }));
    } else {
      var img = document.createElement('img');
      resolve(img);
    }
  });
}
