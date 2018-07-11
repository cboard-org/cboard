import React from 'react';
import { connect } from 'react-redux';
import CommunicatorDialog from './CommunicatorDialog.component';
import { TAB_INDEXES } from './CommunicatorDialog.constants';
import { injectIntl } from 'react-intl';

class CommunicatorDialogContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      boards: props.communicatorBoards,
      selectedTab: TAB_INDEXES.COMMUNICATOR_BOARDS
    };
  }

  onTabChange(event, selectedTab = TAB_INDEXES.COMMUNICATOR_BOARDS) {
    this.setState({ selectedTab, boards: [], loading: true });

    setTimeout(() => {
      this.setState({ boards: this.props.communicatorBoards, loading: false });
    }, 300);
  }

  render() {
    const dialogProps = {
      ...this.props,
      ...this.state,
      onTabChange: this.onTabChange.bind(this)
    };

    return <CommunicatorDialog {...dialogProps} />;
  }
}

const mapStateToProps = ({ board, communicator, language }, ownProps) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );

  const communicatorBoards = board.boards.filter(
    board => currentCommunicator.boards.indexOf(board.id) >= 0
  );

  return {
    ...ownProps,
    communicatorBoards
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CommunicatorDialogContainer));
