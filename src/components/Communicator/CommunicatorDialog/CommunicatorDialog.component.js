import React from 'react';
import PropTypes from 'prop-types';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import BrokenIcon from '@material-ui/icons/BrokenImage';
import IconButton from '../../UI/IconButton';
import { intlShape } from 'react-intl';

import { TAB_INDEXES } from './CommunicatorDialog.constants';
import messages from './CommunicatorDialog.messages';

import './CommunicatorDialog.css';

const CommunicatorDialog = ({
  open,
  intl,
  selectedTab,
  loading,
  boards,
  onClose,
  onTabChange
}) => (
  <FullScreenDialog
    disableSubmit={true}
    open={open}
    title={intl.formatMessage(messages.title)}
    onClose={onClose}
  >
    <Paper>
      <FullScreenDialogContent className="CommunicatorDialog__container">
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          className="CommunicatorDialog__tabs"
          fixed
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
                      {intl.formatMessage(messages.title)}
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
                {boards.map((board, i) => {
                  const title = intl.formatMessage({
                    id: board.nameKey || board.name || board.id
                  });
                  return (
                    <div key={i} className="CommunicatorDialog__boards__item">
                      <div className="CommunicatorDialog__boards__item__image">
                        {!!board.caption && (
                          <img src={board.caption} alt={title} />
                        )}
                        {!board.caption && (
                          <div className="CommunicatorDialog__boards__item__image__empty">
                            <BrokenIcon />
                          </div>
                        )}
                        <div className="CommunicatorDialog__boards__item__image__button">
                          <IconButton
                            label={intl.formatMessage(
                              selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS
                                ? messages.removeBoard
                                : messages.addBoard
                            )}
                            onClick={() => {}}
                          >
                            {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS ? (
                              <RemoveIcon />
                            ) : (
                              <AddIcon />
                            )}
                          </IconButton>
                        </div>
                      </div>
                      <div className="CommunicatorDialog__boards__item__data">
                        <div className="CommunicatorDialog__boards__item__data__button">
                          <IconButton
                            label={intl.formatMessage(messages.menu)}
                            onClick={() => {}}
                          >
                            <MenuIcon />
                          </IconButton>
                        </div>

                        <div className="CommunicatorDialog__boards__item__data__title">
                          {title}
                        </div>
                        <div className="CommunicatorDialog__boards__item__data__author">
                          {board.author}
                        </div>
                        <div className="CommunicatorDialog__boards__item__data__extra">
                          {selectedTab === TAB_INDEXES.ALL_BOARDS && (
                            <PublicIcon />
                          )}
                          {selectedTab === TAB_INDEXES.MY_BOARDS &&
                            board.isPublic && <PublicIcon />}
                          {selectedTab === TAB_INDEXES.MY_BOARDS &&
                            !board.isPublic && <KeyIcon />}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
  selectedTab: 0,
  boards: [],
  onClose: () => {},
  onTabChange: () => {}
};

CommunicatorDialog.propTypes = {
  boards: PropTypes.array,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  selectedTab: PropTypes.number,
  intl: intlShape,
  onClose: PropTypes.func,
  onTabChange: PropTypes.func
};

export default CommunicatorDialog;
