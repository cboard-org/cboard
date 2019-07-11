import configureStore from '../store';
describe('store', () => {
  it('should configure Store', () => {
    const store = configureStore();
    expect(store).toBeDefined();
  });
});
