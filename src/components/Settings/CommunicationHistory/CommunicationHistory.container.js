import { connect } from 'react-redux';
import CommunicationHistory from './CommunicationHistory.component';
import { clearCommunicationHistory } from '../../CommunicationHistory/CommunicationHistory.actions';

const mapStateToProps = state => ({
  communicationHistory: state.communicationHistory.entries,
  userData: state.app.userData
});

const mapDispatchToProps = {
  clearHistory: clearCommunicationHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicationHistory);
