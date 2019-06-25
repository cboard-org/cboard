
import register from '../registerServiceWorker';
import unregister from '../registerServiceWorker';
describe('registerServiceWorker', () => {

  global.navigator = Object.create(navigator);
  Object.defineProperty(navigator, 'serviceWorker', {
    value: { ready: false }
  });
  global.process.env = Object.create(process.env);
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: 'production'
  });
  global.process.env = Object.create(process.env);
  Object.defineProperty(process.env, 'PUBLIC_URL', {
    value: 'https://app.cboard.io'
  });
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      href: 'https://app.cboard.io',
      origin: 'https://app.cboard.io'
    },
    writable: true
  });

  it('should register Service Worker', () => {
    const serviceWorker = register(jest.fn(), jest.fn());
    expect(serviceWorker).toBeDefined;
  });
  it('should unregister Service Worker', () => {
    const serviceWorker = unregister();
    expect(serviceWorker).toBeDefined;
  });
});
