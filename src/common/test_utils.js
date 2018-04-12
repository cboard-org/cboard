import React from 'react';
import { IntlProvider } from 'react-intl';
import ShallowRenderer from 'react-test-renderer/shallow';
import renderer from 'react-test-renderer';

const shallowRenderer = new ShallowRenderer();

export function shallowMatchSnapshot(component) {
  const cmp = shallowRenderer.render(component);
  expect(cmp).toMatchSnapshot();
}

export function matchSnapshot(component) {
  const cmp = renderer.create(component);
  expect(cmp).toMatchSnapshot();
}

export function matchSnapshotWithIntlProvider(
  children,
  props = { locale: 'en-US' }
) {
  const cmp = renderer.create(
    <IntlProvider {...props}>{children}</IntlProvider>
  );
  expect(cmp).toMatchSnapshot();
}
