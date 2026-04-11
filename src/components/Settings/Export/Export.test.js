import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import intl from 'react-intl';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Export from './Export.component';

jest.mock('./Export.messages', () => {
  return {
    export: {
      id: 'cboard.components.Settings.Export.export',
      defaultMessage: 'Export'
    },
    exportSingle: {
      id: 'cboard.components.Settings.Export.exportSingle',
      defaultMessage: 'Export a single board'
    },
    exportSingleSecondary: {
      id: 'cboard.components.Settings.Export.exportSingleSecondary',
      defaultMessage:
        'This option will export a single board you have from a list of boards. You can choose {cboardLink}, {link} or PDF formats.'
    },
    exportAll: {
      id: 'cboard.components.Settings.Export.exportAll',
      defaultMessage: 'Export All Boards'
    },
    exportAllSecondary: {
      id: 'cboard.components.Settings.Export.exportAllSecondary',
      defaultMessage:
        'This option will export ALL the boards you have if you choose {cboardLink} format or {link} format. It will export JUST the current board if you choose PDF format.'
    },
    boardDownloaded: {
      id: 'cboard.components.Settings.Export.boardDownloaded',
      defaultMessage: 'Your board(s) was downloaded'
    },
    boardDownloadedCva: {
      id: 'cboard.components.Settings.Export.boardDownloadedCva',
      defaultMessage:
        'Your board was downloaded. Find your file under the downloads folder'
    },
    boards: {
      id: 'cboard.components.Settings.Export.boards',
      defaultMessage: 'Boards'
    }
  };
});

const COMPONENT_PROPS = {
  onExportClick: () => {},
  onClose: () => {},
  intl: {
    formatMessage: jest.fn(),
    locale: 'en-US'
  },
  boards: []
};

describe('Export tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Export {...COMPONENT_PROPS} />);
  });

  test('export single board button is disabled when no board or format is selected', () => {
    const wrapper = shallow(<Export {...COMPONENT_PROPS} />);
    const buttons = wrapper.find('WithStyles(ForwardRef(Button))');
    const singleExportButton = buttons.at(0);
    expect(singleExportButton.prop('disabled')).toBe(true);
  });

  test('export all boards button is disabled when no format is selected', () => {
    const wrapper = shallow(<Export {...COMPONENT_PROPS} />);
    const buttons = wrapper.find('WithStyles(ForwardRef(Button))');
    const allExportButton = buttons.at(1);
    expect(allExportButton.prop('disabled')).toBe(true);
  });

  test('calls onExportClick when export single board button is clicked with valid selections', () => {
    const onExportClick = jest.fn();
    const wrapper = shallow(
      <Export {...COMPONENT_PROPS} onExportClick={onExportClick} />
    );
    wrapper.setState({
      singleBoard: { id: 'board1', name: 'Test Board' },
      exportSingleBoard: 'pdf'
    });
    wrapper.instance().handleSingleExport();
    expect(onExportClick).toHaveBeenCalled();
  });

  test('calls onExportClick when export all boards button is clicked with valid format', () => {
    const onExportClick = jest.fn();
    const wrapper = shallow(
      <Export {...COMPONENT_PROPS} onExportClick={onExportClick} />
    );
    wrapper.setState({ exportAllBoard: 'cboard' });
    wrapper.instance().handleAllExport();
    expect(onExportClick).toHaveBeenCalled();
  });

  test('sets boardError when export single is clicked without selecting a board', () => {
    const wrapper = shallow(<Export {...COMPONENT_PROPS} />);
    wrapper.setState({ exportSingleBoard: 'pdf' });
    wrapper.instance().handleSingleExport();
    expect(wrapper.state('boardError')).toBe(true);
  });
});
