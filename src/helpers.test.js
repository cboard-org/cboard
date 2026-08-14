import { isDataURL, isLocalFileURL } from './helpers';

describe('isDataURL', () => {
  it('returns true for data URLs', () => {
    expect(isDataURL('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
    expect(isDataURL('data:text/plain;charset=utf-8;base64,dGVzdA==')).toBe(
      true
    );
  });

  it('returns false for non-data URLs', () => {
    expect(isDataURL('https://example.com/image.png')).toBe(false);
    expect(isDataURL('http://example.com/image.png')).toBe(false);
    expect(isDataURL('file:///storage/img.png')).toBe(false);
    expect(isDataURL('cdvfile://localhost/persistent/img.png')).toBe(false);
    expect(isDataURL('iVBORw0KGgo=')).toBe(false);
  });

  it('returns false for non-strings', () => {
    expect(isDataURL(null)).toBe(false);
    expect(isDataURL(undefined)).toBe(false);
    expect(isDataURL(123)).toBe(false);
    expect(isDataURL({})).toBe(false);
  });
});

describe('isLocalFileURL', () => {
  it('returns true for file and cdvfile URLs', () => {
    expect(isLocalFileURL('file:///storage/emulated/0/img.png')).toBe(true);
    expect(isLocalFileURL('cdvfile://localhost/persistent/img.png')).toBe(true);
    expect(isLocalFileURL('FILE:///storage/img.png')).toBe(true);
  });

  it('returns false for non-local URLs', () => {
    expect(isLocalFileURL('https://example.com/image.png')).toBe(false);
    expect(isLocalFileURL('http://example.com/image.png')).toBe(false);
    expect(isLocalFileURL('data:image/png;base64,iVBORw0KGgo=')).toBe(false);
  });

  it('returns false for non-strings', () => {
    expect(isLocalFileURL(null)).toBe(false);
    expect(isLocalFileURL(undefined)).toBe(false);
    expect(isLocalFileURL(123)).toBe(false);
  });
});
