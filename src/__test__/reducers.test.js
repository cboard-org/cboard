import createReducer from '../reducers';
describe('reducers', () => {
  it('should create Reducer', () => {
    const red = createReducer();
    expect(red).toBeDefined;
  });
});
