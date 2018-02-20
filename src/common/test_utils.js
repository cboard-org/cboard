import ShallowRenderer from 'react-test-renderer/shallow';
import NormalRenderer from 'react-test-renderer';

const shallowRenderer = new ShallowRenderer();

export function shallowMatchSnapshot(component) {
  const cmp = shallowRenderer.render(component);
  expect(cmp).toMatchSnapshot();
}

export function normalMatchSnapshot(component) {
  const cmp = NormalRenderer.create(component);
  expect(cmp).toMatchSnapshot();
}
