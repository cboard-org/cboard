import React from 'react';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import TonalChip from '../TonalChip';
import SectionHeader from './SectionHeader';

jest.mock('./Dashboard.messages', () => ({
  __esModule: true,
  default: new Proxy(
    {},
    {
      get: (target, prop) => ({
        id: String(prop),
        defaultMessage: String(prop)
      })
    }
  )
}));

const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

const render = (props = {}) =>
  mount(
    <SectionHeader
      intl={intl}
      title="QR codes"
      hint="Print, download, share"
      chipLabel="3 QR codes"
      {...props}
    />
  );

describe('SectionHeader', () => {
  it('renders the title as a heading with its hint', () => {
    const wrapper = render();
    expect(wrapper.find('h2').text()).toBe('QR codes');
    expect(wrapper.text()).toContain('Print, download, share');
  });

  it('renders the count chip', () => {
    expect(render().find(TonalChip).prop('label')).toBe('3 QR codes');
  });

  it('omits the chip and hint when not given', () => {
    const wrapper = render({ chipLabel: undefined, hint: undefined });
    expect(wrapper.find(TonalChip)).toHaveLength(0);
    expect(wrapper.find('p')).toHaveLength(0);
  });

  it('shows the navigation button only with onOpenNav', () => {
    expect(render().find(IconButton)).toHaveLength(0);

    const onOpenNav = jest.fn();
    const button = render({ onOpenNav }).find(IconButton);
    expect(button.prop('aria-label')).toBe('navigation');
    button.find('button').simulate('click');
    expect(onOpenNav).toHaveBeenCalled();
  });
});
