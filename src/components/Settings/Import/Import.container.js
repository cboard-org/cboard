import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import shortid from 'shortid';

import { addBoards, changeBoard } from '../../Board/Board.actions';
import {
  upsertCommunicator,
  changeCommunicator
} from '../../Communicator/Communicator.actions';
import { switchBoard } from '../../Board/Board.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import Import from './Import.component';
import API from '../../../api';
import messages from './Import.messages';

export class ImportContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired
  };

  async updateLoadBoardsIds(boards, shouldUpdate = false) {
    const updatedBoards = await Promise.all(
      boards.map(async board => {
        const boardsToBeLoaded = {};
        const tilesToBeReplaced = {};
        const tempBoards = this.props.boards
          .concat(boards)
          .filter(b => b.prevId);
        let updated = false;
        board.tiles.forEach((tile, i) => {
          if (tile.loadBoard) {
            const boardToBeLoaded = tempBoards.find(
              tb => tb.prevId && tb.prevId === tile.loadBoard
            );
            if (boardToBeLoaded) {
              tilesToBeReplaced[i] = tile;
              boardsToBeLoaded[boardToBeLoaded.prevId] = boardToBeLoaded.id;
            }
          }
        });

        const tilesIndexes = Object.keys(tilesToBeReplaced);
        tilesIndexes.forEach(i => {
          const tile = board.tiles[i];

          if (boardsToBeLoaded[tile.loadBoard]) {
            board.tiles[i].loadBoard = boardsToBeLoaded[tile.loadBoard];

            updated = true;
          }
        });

        let boardToBeUpdated = board;
        if (shouldUpdate && updated) {
          boardToBeUpdated = await API.updateBoard(boardToBeUpdated);
        }

        return boardToBeUpdated;
      })
    );

    return updatedBoards;
  }

  async syncBoardsWithAPI(boards) {
    const { userData } = this.props;

    let boardsResponse = boards;
    if (userData.email) {
      const { email, name: author } = userData;

      boardsResponse = await Promise.all(
        boards.map(async board => {
          const boardToCreate = {
            ...board,
            email,
            author,
            isPublic: false,
            locale: this.props.intl.locale
          };
          //board validate
          if (typeof boardToCreate.id !== 'undefined') {
            delete boardToCreate.id;
          }
          if (typeof boardToCreate.name === 'undefined') {
            boardToCreate.name = 'unknow';
          }
          try {
            const response = await API.createBoard(boardToCreate);
            if (board.id) {
              response.prevId = board.id;
            }
            return response;
          } catch (err) {
            console.log(err.message);
            return board
          }
        })
      );
    } else {
      boardsResponse.forEach(board => {
        if (board.id) {
          board.prevId = board.id;
        }
        board.id = shortid.generate();
      });
    }

    boardsResponse = await this.updateLoadBoardsIds(
      boardsResponse,
      userData.email
    );

    this.props.addBoards(boardsResponse);
    await this.addBoardsToCommunicator(boardsResponse);
    this.props.switchBoard(boardsResponse[0].id);
  }

  async addBoardsToCommunicator(boards) {
    const { userData, currentCommunicator } = this.props;

    const communicatorBoards = new Set(
      currentCommunicator.boards.concat(boards.map(b => b.id))
    );
    let communicatorModified = {
      ...currentCommunicator,
      boards: Array.from(communicatorBoards)
    };

    if (userData && userData.authToken && userData.authToken.length) {
      try {
        communicatorModified = await API.updateCommunicator(communicatorModified);
      } catch (err) {
        console.log(err.message);
      }
    }

    this.props.upsertCommunicator(communicatorModified);
    this.props.changeCommunicator(communicatorModified.id);
  }

  async handleImportClick(e, doneCallback) {
    const { showNotification, intl, boards } = this.props;

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const ext = file.name.match(/\.([^.]+)$/)[1];
        const importConstants = await import('./Import.constants');

        const importCallback =
          importConstants.IMPORT_CONFIG_BY_EXTENSION[ext.toLowerCase()];
        if (importCallback) {
          // TODO. Json format validation
          try {
            const jsonFile = await importCallback(
              file,
              this.props.intl,
              boards
            );
            if (jsonFile.length) {
              const importHelpers = await import('./Import.helpers');
              await importHelpers.requestQuota(jsonFile);
              await this.syncBoardsWithAPI(jsonFile);
              showNotification(
                intl.formatMessage(messages.success, {
                  boards: jsonFile.length
                })
              );
            } else {
              showNotification(intl.formatMessage(messages.emptyImport));
            }
          } catch (e) {
            showNotification(intl.formatMessage(messages.errorImport));
            console.error(e);
          }
        } else {
          showNotification(intl.formatMessage(messages.invalidImport));
          alert('Please, select a valid file: json, obz, obf');
        }
      } else {
        showNotification(intl.formatMessage(messages.noImport));
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
  switchBoard,
  upsertCommunicator,
  changeCommunicator,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ImportContainer));
