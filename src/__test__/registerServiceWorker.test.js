import register from '../registerServiceWorker';
import unregister from '../registerServiceWorker';

describe('registerServiceWorker', () => {
  it('should register Service Worker', () => {
    const serviceWorker = register(jest.fn(), jest.fn());
    expect(serviceWorker).toBeDefined;
  });
  it('should register Service Worker', () => {
    global.process.env.NODE_ENV = 'development';
    const serviceWorker = register(jest.fn(), jest.fn());
    expect(serviceWorker).toBeDefined;
  });
  it('should unregister Service Worker', () => {
    const serviceWorker = unregister();
    expect(serviceWorker).toBeDefined;
  });
});
