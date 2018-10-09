import React from 'react';
import PropTypes from 'prop-types';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { intlShape, FormattedMessage } from 'react-intl';

import { TAB_INDEXES } from './CommunicatorDialog.constants';
import CommunicatorBoardItem from './CommunicatorBoardItem.component';
import messages from './CommunicatorDialog.messages';

import './CommunicatorDialog.css';
import CommunicatorDialogButtons from './CommunicatorDialogButtons.component';
import { Button } from '@material-ui/core';

const CommunicatorDialog = ({
  open,
  intl,
  selectedTab,
  loading,
  boards,
  limit,
  page,
  totalPages,
  userData,
  communicatorBoardsIds,
  communicator,
  search,
  isSearchOpen,
  loadNextPage,
  onClose,
  onTabChange,
  onSearch,
  openSearchBar,
  addOrRemoveBoard,
  setRootBoard,
  publishBoardAction
}) => (
  <FullScreenDialog
    disableSubmit={true}
    open={open}
    title={intl.formatMessage(messages.title)}
    onClose={onClose}
    buttons={
      <CommunicatorDialogButtons
        intl={intl}
        onSearch={onSearch}
        openSearchBar={openSearchBar}
        isSearchOpen={isSearchOpen}
        searchValue={search}
      />
    }
  >
    <Paper>
      <FullScreenDialogContent className="CommunicatorDialog__container">
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          className="CommunicatorDialog__tabs"
          fixed="top"
          scrollable
          scrollButtons="off"
        >
          <Tab
            label={intl.formatMessage(messages.communicatorBoards)}
            className={
              selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS ? 'active' : ''
            }
          />
          <Tab
            label={intl.formatMessage(messages.allBoards)}
            className={selectedTab === TAB_INDEXES.ALL_BOARDS ? 'active' : ''}
          />
          <Tab
            disabled={!userData.authToken}
            label={intl.formatMessage(messages.myBoards)}
            className={selectedTab === TAB_INDEXES.MY_BOARDS ? 'active' : ''}
          />
        </Tabs>

        <div className="CommunicatorDialog__content">
          {!loading && (
            <React.Fragment>
              {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS && (
                <div className="CommunicatorDialog__communicatorData">
                  <React.Fragment>
                    <div className="CommunicatorDialog__communicatorData__title">
                      {communicator.name}
                    </div>
                    <div className="CommunicatorDialog__communicatorData__boardsQty">
                      {intl.formatMessage(messages.boardsQty, {
                        qty: boards.length
                      })}
                    </div>
                  </React.Fragment>
                </div>
              )}

              <div className="CommunicatorDialog__boards">
                {!boards.length && (
                  <div className="CommunicatorDialog__boards__emptyMessage">
                    <FormattedMessage {...messages.emptyBoardsList} />
                  </div>
                )}

                {boards.slice(0, limit).map((board, i) => (
                  <CommunicatorBoardItem
                    key={i}
                    board={board}
                    intl={intl}
                    selectedTab={selectedTab}
                    addOrRemoveBoard={addOrRemoveBoard}
                    publishBoardAction={publishBoardAction}
                    setRootBoard={setRootBoard}
                    selectedIds={communicatorBoardsIds}
                    userData={userData}
                    communicator={communicator}
                  />
                ))}

                {page < totalPages && (
                  <Button onClick={loadNextPage}>
                    <FormattedMessage {...messages.loadNextPage} />
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}

          {loading && (
            <CircularProgress
              size={25}
              className="CommunicatorDialog__spinner"
              thickness={7}
            />
          )}
        </div>
      </FullScreenDialogContent>
    </Paper>
  </FullScreenDialog>
);

CommunicatorDialog.defaultProps = {
  open: false,
  loading: false,
  userData: null,
  limit: 10,
  page: 1,
  totalPages: 1,
  selectedTab: 0,
  boards: [],
  communicatorBoardsIds: [],
  loadNextPage: () => {},
  onClose: () => {},
  onTabChange: () => {},
  onSearch: () => {}
};

CommunicatorDialog.propTypes = {
  boards: PropTypes.array,
  userData: PropTypes.object,
  limit: PropTypes.number,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  selectedTab: PropTypes.number,
  communicator: PropTypes.object,
  communicatorBoardsIds: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape,
  loadNextPage: PropTypes.func,
  onClose: PropTypes.func,
  onTabChange: PropTypes.func,
  onSearch: PropTypes.func,
  addOrRemoveBoard: PropTypes.func.isRequired,
  setRootBoard: PropTypes.func.isRequired,
  publishBoardAction: PropTypes.func.isRequired
};

export default CommunicatorDialog;
