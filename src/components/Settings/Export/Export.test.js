import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Export from './Export.component';

jest.mock('./Export.messages', () => {
  return {
    export: {
      id: 'cboard.components.Settings.Export.export',
      defaultMessage: 'Export'
    },
    exportSecondary: {
      id: 'cboard.components.Settings.Export.exportSecondary',
      defaultMessage: 'Backup your boards'
    }
  };
});

const COMPONENT_PROPS = {
  onExportClick: () => {},
  onClose: () => {}
};

describe('Export tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Export {...COMPONENT_PROPS} />);
  });

  test('menu behavior', () => {
    const wrapper = shallow(<Export {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    let exportMenu = wrapper.find('#export-menu').get(0);
    expect(exportMenu.props.open).toBe(false);

    const exportButton = wrapper.find('#export-button');
    exportButton.simulate('click', { currentTarget: 'someElement' });

    exportMenu = wrapper.find('#export-menu').get(0);
    expect(exportMenu.props.open).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });

  test('loading behavior', () => {
    const wrapper = shallow(<Export {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    wrapper.instance().onExportClick = jest.fn(type => {
      wrapper.setState({
        loading: true,
        exportMenu: null
      });
    });

    let exportMenu = wrapper.find('#export-menu').get(0);
    expect(exportMenu.props.open).toBe(false);

    const exportButton = wrapper.find('#export-button');
    exportButton.simulate('click', { currentTarget: 'someElement' });

    exportMenu = wrapper.find('#export-menu').get(0);
    expect(exportMenu.props.open).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    const openboardOption = wrapper
      .find('WithStyles(ForwardRef(MenuItem))')
      .get(1);
    openboardOption.props.onClick();

    const spinnerWrapper = wrapper.find('.Export__ButtonContainer--spinner');
    expect(spinnerWrapper.length).toBe(1);

    expect(wrapper.find('#export-button').get(0).props.disabled).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
  test('check click ', () => {
    const wrapper = shallow(<Export {...COMPONENT_PROPS} />);
    const cboard = wrapper.find('WithStyles(ForwardRef(MenuItem))').at(0);
    cboard.simulate('click');
  });
  test('close click ', () => {
    const wrapper = shallow(<Export {...COMPONENT_PROPS} />);
    const menu = wrapper.find('#export-menu');
    menu.simulate('close');
  });
});
