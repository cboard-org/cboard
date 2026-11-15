import React from 'react';
import { shallow } from 'enzyme';
import { ExportContainer } from './Export.container';
import * as exportHelpers from './Export.helpers';

jest.mock('./Export.helpers', () => ({
  openboardExportAdapter: jest.fn(),
  cboardExportAdapter: jest.fn(),
  pdfExportAdapter: jest.fn()
}));

jest.mock('./Export.messages', () => ({
  boardDownloaded: { id: 'cboard.components.Settings.Export.boardDownloaded' }
}));

const intl = { formatMessage: jest.fn(), locale: 'en-US' };
const boards = [
  { id: 'root', name: 'Home', tiles: [] },
  { id: 'food', name: 'Food', tiles: [] }
];

const exportWith = async (...args) => {
  const doneCallback = jest.fn();
  const wrapper = shallow(
    <ExportContainer
      boards={boards}
      activeBoardId="root"
      history={{ goBack: jest.fn() }}
      intl={intl}
      showNotification={jest.fn()}
    />
  );
  await wrapper.instance().handleExportClick(...args, doneCallback);
  expect(doneCallback).toHaveBeenCalledTimes(1);
};

describe('ExportContainer OpenBoard export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports all boards with intl as the second argument', async () => {
    await exportWith('openboard', '', 'medium');

    expect(exportHelpers.openboardExportAdapter).toHaveBeenCalledTimes(1);
    expect(exportHelpers.openboardExportAdapter).toHaveBeenCalledWith(
      boards,
      intl
    );
  });

  it('exports a single board with intl as the second argument', async () => {
    await exportWith('openboard', boards[1], 'medium');

    expect(exportHelpers.openboardExportAdapter).toHaveBeenCalledTimes(1);
    expect(exportHelpers.openboardExportAdapter).toHaveBeenCalledWith(
      boards[1],
      intl
    );
  });
});
