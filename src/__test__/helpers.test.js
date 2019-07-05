import * as helpers from '../helpers';
describe('helpers', () => {
  it('should create a file from data', () => {
    const dataUrl = 'data:text/plain;charset=utf-8;base64,dGVzdGluZw==';
    const file = helpers.dataURLtoFile(dataUrl, 'myfile');
    expect(file.name).toBe('myfile');
  });
  it('should create a file with ext from data', () => {
    const dataUrl = 'data:text/plain;charset=utf-8;base64,dGVzdGluZw==';
    const file = helpers.dataURLtoFile(dataUrl, 'myfile.txt', true);
    expect(file.name).toBe('myfile.txt.plain');
  });
});
