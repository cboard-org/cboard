import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import ExportDialog from './ExportDialog.component';
import PDFReportService from '../../../services/PDFReportService';
import {
  exportCommunicationHistoryStarted,
  exportCommunicationHistorySuccess,
  exportCommunicationHistoryFailure
} from '../CommunicationHistory.actions';
import { showNotification } from '../../Notifications/Notifications.actions';

const mapStateToProps = state => ({
  communicationHistory: state.communicationHistory.entries,
  isExporting: state.communicationHistory.isExporting,
  currentUserId: state.app.userData?.id || null,
  currentUserName: state.app.userData?.name || null
});

const mapDispatchToProps = dispatch => ({
  onExport: async exportData => {
    dispatch(exportCommunicationHistoryStarted());
    try {
      await PDFReportService.generateCommunicationReport(exportData);
      dispatch(exportCommunicationHistorySuccess());
      dispatch(showNotification('PDF report exported successfully'));
    } catch (error) {
      console.error('Error exporting PDF:', error);
      dispatch(exportCommunicationHistoryFailure(error.message));
      dispatch(showNotification('Error exporting PDF report', 'error'));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ExportDialog));
