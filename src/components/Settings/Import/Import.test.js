import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';

import Import from './Import.component';

jest.mock('./Import.messages', () => {
  return {
    import: {
      id: 'cboard.components.Settings.Import.import',
      defaultMessage: 'Import'
    },
    restore: {
      id: 'cboard.components.Settings.Import.restore',
      defaultMessage: 'Restore'
    },
    exportSecondary: {
      id: 'cboard.components.Settings.Import.importSecondary',
      defaultMessage: 'Backup your boards'
    }
  };
});

const COMPONENT_PROPS = {
  onImportClick: () => {},
  onClose: () => {}
};

describe('Import tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Import {...COMPONENT_PROPS} />);
  });

  test('loading behavior', () => {
    const wrapper = shallow(<Import {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    wrapper.instance().onImportClick = jest.fn(type => {
      wrapper.setState({ loading: true });
    });

    let spinnerWrapper = wrapper.find('.Import__ButtonContainer--spinner');
    expect(spinnerWrapper.length).toBe(0);

    const importButton = wrapper.find('#import-button input');
    importButton.simulate('change', { currentTarget: 'someElement' });

    spinnerWrapper = wrapper.find('.Import__ButtonContainer--spinner');
    expect(spinnerWrapper.length).toBe(1);

    expect(wrapper.find('#import-button').get(0).props.disabled).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
  test('check click ', () => {
    const event = {
      persist: jest.fn()
    };
    const wrapper = shallow(<Import {...COMPONENT_PROPS} />);
    const cboard = wrapper.find('#file');
    cboard.prop('onChange')(event);
  });
});
