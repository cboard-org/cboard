import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { importBoards, changeBoard } from '../../Board/Board.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import Import from './Import.component';
import { IMPORT_CONFIG_BY_EXTENSION } from './Import.constants';
import { requestQuota } from './Import.helpers';

export class ImportContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired
  };

  async handleImportClick(e) {
    const { importBoards, changeBoard, showNotification } = this.props;

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
            importBoards(jsonFile);
            changeBoard(jsonFile[0].id);
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

const mapStateToProps = state => ({
  boards: state.board.boards
});

const mapDispatchToProps = {
  importBoards,
  changeBoard,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ImportContainer));
