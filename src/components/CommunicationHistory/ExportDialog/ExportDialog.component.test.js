import React from 'react';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';
import { ExportDialog } from './ExportDialog.component';

jest.mock('./ExportDialog.messages', () => ({
  __esModule: true,
  default: {
    exportTitle: {
      id: 'exportTitle',
      defaultMessage: 'Export Communication History'
    },
    dateRange: { id: 'dateRange', defaultMessage: 'Date Range' },
    allTime: { id: 'allTime', defaultMessage: 'All Time' },
    today: { id: 'today', defaultMessage: 'Today' },
    lastWeek: { id: 'lastWeek', defaultMessage: 'Last 7 Days' },
    lastMonth: { id: 'lastMonth', defaultMessage: 'Last 30 Days' },
    customRange: { id: 'customRange', defaultMessage: 'Custom Range' },
    startDate: { id: 'startDate', defaultMessage: 'Start Date' },
    endDate: { id: 'endDate', defaultMessage: 'End Date' },
    exportOptions: { id: 'exportOptions', defaultMessage: 'Export Options' },
    includeImages: {
      id: 'includeImages',
      defaultMessage: 'Include pictogram images'
    },
    includeSummary: {
      id: 'includeSummary',
      defaultMessage: 'Include summary statistics'
    },
    includeMetadata: {
      id: 'includeMetadata',
      defaultMessage: 'Include session metadata'
    },
    previewStats: { id: 'previewStats', defaultMessage: 'Preview Statistics' },
    totalEntries: { id: 'totalEntries', defaultMessage: 'Total Entries:' },
    symbols: { id: 'symbols', defaultMessage: 'Symbols:' },
    phrases: { id: 'phrases', defaultMessage: 'Phrases:' },
    cancel: { id: 'cancel', defaultMessage: 'Cancel' },
    export: { id: 'export', defaultMessage: 'Export PDF' },
    exporting: { id: 'exporting', defaultMessage: 'Exporting...' }
  }
}));

const baseProps = {
  open: true,
  onClose: jest.fn(),
  onExport: jest.fn(),
  communicationHistory: [
    {
      id: '1',
      type: 'symbol',
      label: 'Hello',
      timestamp: '2024-01-15T10:00:00.000Z'
    },
    {
      id: '2',
      type: 'phrase',
      label: 'I want water',
      timestamp: '2024-01-16T10:00:00.000Z'
    }
  ],
  currentUserId: 'user-123',
  currentUserName: 'Jane Doe',
  intl: {
    formatMessage: msg => msg.defaultMessage || msg.id
  },
  isExporting: false
};

describe('ExportDialog component', () => {
  it('does not render user selection controls', () => {
    const wrapper = shallow(<ExportDialog {...baseProps} />);

    expect(wrapper.text()).not.toContain('Select User');
    expect(wrapper.text()).not.toContain('All Users');
  });

  it('exports using current user metadata', () => {
    const onExport = jest.fn();
    const wrapper = shallow(
      <ExportDialog {...baseProps} onExport={onExport} />
    );

    wrapper
      .find(Button)
      .at(1)
      .prop('onClick')();

    expect(onExport).toHaveBeenCalledWith(
      expect.objectContaining({
        entries: baseProps.communicationHistory,
        userId: 'user-123',
        userName: 'Jane Doe',
        dateRange: expect.objectContaining({ type: 'all' })
      })
    );
  });

  it('uses Guest metadata when no current user is available', () => {
    const onExport = jest.fn();
    const wrapper = shallow(
      <ExportDialog
        {...baseProps}
        onExport={onExport}
        currentUserId={null}
        currentUserName={null}
      />
    );

    wrapper
      .find(Button)
      .at(1)
      .prop('onClick')();

    expect(onExport).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'Guest',
        userName: 'Guest'
      })
    );
  });
});
