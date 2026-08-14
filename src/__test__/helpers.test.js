import * as helpers from '../helpers';
describe('helpers', () => {
  it('should create a blob from a data URL', () => {
    const dataUrl = 'data:text/plain;charset=utf-8;base64,dGVzdGluZw==';
    const blob = helpers.dataURLtoBlob(dataUrl);
    expect(blob.type).toBe('text/plain');
    expect(blob.size).toBe(7);
  });
});
