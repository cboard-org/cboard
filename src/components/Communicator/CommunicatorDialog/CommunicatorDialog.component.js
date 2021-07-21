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
import CommunicatorDialogBoardItem from './CommunicatorDialogBoardItem.component';
import messages from './CommunicatorDialog.messages';

import './CommunicatorDialog.css';
import CommunicatorDialogButtons from './CommunicatorDialogButtons.component';
import { Button } from '@material-ui/core';

import CommunicatorDialogTour from './CommunicatorDialogTour.component';

const CommunicatorDialog = ({
  open,
  intl,
  selectedTab,
  loading,
  nextPageLoading,
  boards,
  total,
  limit,
  page,
  totalPages,
  userData,
  communicatorBoardsIds,
  communicator,
  activeBoardId,
  search,
  isSearchOpen,
  loadNextPage,
  onClose,
  onTabChange,
  onSearch,
  openSearchBar,
  addOrRemoveBoard,
  copyBoard,
  deleteMyBoard,
  updateMyBoard,
  setRootBoard,
  publishBoard,
  showNotification,
  dark,
  communicatorTour,
  disableTour
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
        dark={dark}
      />
    }
  >
    <Paper className={dark ? 'is-dark' : ''}>
      <FullScreenDialogContent className="CommunicatorDialog__container">
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          className="CommunicatorDialog__tabs"
          fixed="top"
          variant="scrollable"
          scrollButtons="off"
        >
          <Tab
            label={intl.formatMessage(messages.communicatorBoards)}
            className={
              selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS ? 'active' : ''
            }
            id="CommunicatorDialog__BoardBtn"
          />
          <Tab
            label={intl.formatMessage(messages.allBoards)}
            className={
              selectedTab === TAB_INDEXES.PUBLIC_BOARDS ? 'active' : ''
            }
            id="CommunicatorDialog__PublicBoardsBtn"
          />
          <Tab
            disabled={!userData.authToken}
            label={intl.formatMessage(messages.myBoards)}
            className={selectedTab === TAB_INDEXES.MY_BOARDS ? 'active' : ''}
            id="CommunicatorDialog__AllMyBoardsBtn"
          />
        </Tabs>

        <div className="CommunicatorDialog__content">
          {!loading && (
            <React.Fragment>
              {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS && (
                <div className="CommunicatorDialog__communicatorData">
                  <React.Fragment>
                    <div className="CommunicatorDialog__communicatorData__title">
                      {intl.formatMessage(messages.title)}
                    </div>
                    <div className="CommunicatorDialog__communicatorData__boardsQty">
                      {intl.formatMessage(messages.boardsQty, {
                        qty: total
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
                  <CommunicatorDialogBoardItem
                    key={i}
                    board={board}
                    intl={intl}
                    selectedTab={selectedTab}
                    addOrRemoveBoard={addOrRemoveBoard}
                    copyBoard={copyBoard}
                    deleteMyBoard={deleteMyBoard}
                    updateMyBoard={updateMyBoard}
                    publishBoard={publishBoard}
                    setRootBoard={setRootBoard}
                    selectedIds={communicatorBoardsIds}
                    userData={userData}
                    communicator={communicator}
                    showNotification={showNotification}
                    activeBoardId={activeBoardId}
                    dark={dark}
                  />
                ))}

                <CommunicatorDialogTour
                  communicatorTour={communicatorTour}
                  selectedTab={selectedTab}
                  disableTour={disableTour}
                  intl={intl}
                />

                {page < totalPages && (
                  <Button color="primary" onClick={loadNextPage}>
                    <FormattedMessage {...messages.loadNextPage} />
                  </Button>
                )}

                {nextPageLoading && (
                  <CircularProgress
                    size={35}
                    className="CommunicatorDialog__spinner"
                    thickness={7}
                  />
                )}
              </div>
            </React.Fragment>
          )}

          {loading && (
            <CircularProgress
              size={35}
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
  nextPageLoading: false,
  userData: null,
  limit: 10,
  page: 1,
  totalPages: 1,
  selectedTab: 0,
  boards: [],
  total: 0,
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
  total: PropTypes.number,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  selectedTab: PropTypes.number,
  communicator: PropTypes.object,
  activeBoardId: PropTypes.string,
  communicatorBoardsIds: PropTypes.arrayOf(PropTypes.string),
  intl: intlShape,
  loadNextPage: PropTypes.func,
  onClose: PropTypes.func,
  onTabChange: PropTypes.func,
  onSearch: PropTypes.func,
  addOrRemoveBoard: PropTypes.func.isRequired,
  deleteMyBoard: PropTypes.func.isRequired,
  updateMyBoard: PropTypes.func.isRequired,
  copyBoard: PropTypes.func.isRequired,
  setRootBoard: PropTypes.func.isRequired,
  publishBoard: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  dark: PropTypes.bool,
  communicatorTour: PropTypes.object.isRequired,
  disableTour: PropTypes.func.isRequired
};

export default CommunicatorDialog;
