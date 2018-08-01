import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { addBoards, changeBoard } from '../../Board/Board.actions';
import {
  editCommunicator,
  createCommunicator,
  changeCommunicator
} from '../../Communicator/Communicator.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import Import from './Import.component';
import { IMPORT_CONFIG_BY_EXTENSION } from './Import.constants';
import { requestQuota } from './Import.helpers';
import API from '../../../api';

export class ImportContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired
  };

  async addBoardsToCommunicator(boards) {
    const { userData, currentCommunicator, communicators } = this.props;
    let communicatorModified = {
      ...currentCommunicator,
      boards: currentCommunicator.boards.concat(boards.map(b => b.id))
    };

    if (userData && userData.authToken && userData.authToken.length) {
      communicatorModified = await API.updateCommunicator(communicatorModified);
    }

    const action =
      communicators.findIndex(c => c.id === communicatorModified.id) >= 0
        ? 'editCommunicator'
        : 'createCommunicator';

    this.props[action](communicatorModified);
    this.props.changeCommunicator(communicatorModified.id);
  }

  async handleImportClick(e, doneCallback) {
    const { addBoards, showNotification } = this.props;

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const ext = file.name.match(/\.([^.]+)$/)[1];
        const importCallback = IMPORT_CONFIG_BY_EXTENSION[ext.toLowerCase()];
        if (importCallback) {
          // TODO. Json format validation
          try {
            const jsonFile = await importCallback(file, this.props.intl);
            await requestQuota(jsonFile);
            await this.addBoardsToCommunicator(jsonFile);
            addBoards(jsonFile);
            showNotification('Backup restored successfuly.');
          } catch (e) {
            console.error(e);
          }
        } else {
          alert('Please, select a valid file: json, obz, obf');
        }
      } else {
        console.warn('There is no selected file.');
      }
    } else {
      console.warn('The File APIs are not fully supported in this browser.');
    }

    if (doneCallback) {
      doneCallback();
    }
  }

  render() {
    const { boards, history } = this.props;

    return (
      <Import
        boards={boards}
        onImportClick={this.handleImportClick.bind(this)}
        onClose={history.goBack}
      />
    );
  }
}

const mapStateToProps = ({ board, communicator, app }) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );

  const { userData } = app;

  return {
    boards: board.boards,
    currentCommunicator,
    communicators: communicator.communicators,
    userData
  };
};

const mapDispatchToProps = {
  addBoards,
  changeBoard,
  editCommunicator,
  createCommunicator,
  changeCommunicator,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ImportContainer));
