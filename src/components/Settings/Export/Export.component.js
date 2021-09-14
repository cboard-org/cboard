import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Export.messages';

import './Export.css';

const propTypes = {
  /**
   * Callback fired when clicking the export Cboard button
   */
  onExportClick: PropTypes.func.isRequired,
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  boards: PropTypes.array.isRequired,
  intl: intlShape.isRequired
};

class Export extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exportSingleBoard: '',
      exportAllBoard: '',
      singleBoard: '',
      loadingSingle: false,
      loadingAll: false,
      boardError: false
    };
  }

  openMenu(e) {
    this.setState({ exportMenu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ exportMenu: null });
  }

  handleBoardChange = event => {
    this.setState({
      boardError: false,
      singleBoard: event.target.value
    });
  };

  handleAllBoardChange = event => {
    const doneCallback = () => {
      this.setState({
        loadingAll: false
      });
    };

    this.setState(
      {
        loadingAll: true,
        exportAllBoard: event.target.value
      },
      () => {
        this.props.onExportClick(this.state.exportAllBoard, '', doneCallback);
      }
    );
  };

  handleSingleBoardChange = event => {
    if (!this.state.singleBoard) {
      this.setState({
        boardError: true
      });
      return;
    }
    const doneCallback = () => {
      this.setState({
        loadingSingle: false
      });
    };

    this.setState(
      {
        loadingSingle: true,
        exportSingleBoard: event.target.value
      },
      () => {
        this.props.onExportClick(
          this.state.exportSingleBoard,
          this.state.singleBoard,
          doneCallback
        );
      }
    );
  };

  render() {
    const { onClose, boards, intl } = this.props;
    return (
      <div className="Export">
        <FullScreenDialog
          open
          title={<FormattedMessage {...messages.export} />}
          onClose={onClose}
        >
          <Paper>
            <List>
              <ListItem className="Export__ListItem">
                <ListItemText
                  className="Export__ListItemText"
                  primary={<FormattedMessage {...messages.exportSingle} />}
                  secondary={
                    <FormattedMessage
                      {...messages.exportSingleSecondary}
                      values={{
                        cboardLink: (
                          <Link
                            href="https://www.cboard.io/help/#HowdoIimportaboardintoCboard"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Cboard
                          </Link>
                        ),
                        link: (
                          <Link
                            href="https://www.openboardformat.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            OpenBoard
                          </Link>
                        )
                      }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <div className="Export__SelectContainer">
                    {this.state.loadingSingle && (
                      <CircularProgress
                        size={25}
                        className="Export__SelectContainer--spinner"
                        thickness={7}
                      />
                    )}
                    {!this.state.loadingSingle && (
                      <div className="Export__SelectContainer">
                        <FormControl
                          className="Export__SelectContainer__Select"
                          variant="standard"
                          error={this.state.boardError}
                          disabled={this.state.loading}
                        >
                          <InputLabel id="boards-select-label">
                            {intl.formatMessage(messages.boards)}
                          </InputLabel>
                          <Select
                            labelId="boards-select-label"
                            id="boards-select"
                            autoWidth={false}
                            value={this.state.singleBoard}
                            onChange={this.handleBoardChange}
                          >
                            {boards.map(
                              board =>
                                !board.hidden && (
                                  <MenuItem key={board.id} value={board}>
                                    {board.name}
                                  </MenuItem>
                                )
                            )}
                          </Select>
                        </FormControl>
                        <FormControl
                          className="Export__SelectContainer__Select"
                          variant="standard"
                          disabled={this.state.loading}
                        >
                          <InputLabel id="export-single-select-label">
                            {intl.formatMessage(messages.export)}
                          </InputLabel>
                          <Select
                            labelId="export-single-select-label"
                            id="export-single-select"
                            autoWidth={false}
                            disabled={this.state.loading}
                            value={this.state.exportSingleBoard}
                            onChange={this.handleSingleBoardChange}
                          >
                            <MenuItem value="cboard">Cboard</MenuItem>
                            <MenuItem value="openboard">OpenBoard</MenuItem>
                            <MenuItem value="pdf">PDF</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </div>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  className="Export__ListItemText"
                  primary={<FormattedMessage {...messages.exportAll} />}
                  secondary={
                    <FormattedMessage
                      {...messages.exportAllSecondary}
                      values={{
                        cboardLink: (
                          <Link
                            href="https://www.cboard.io/help/#HowdoIimportaboardintoCboard"
                            target="_blank"
                          >
                            Cboard
                          </Link>
                        ),
                        link: (
                          <Link
                            href="https://www.openboardformat.org/"
                            target="_blank"
                          >
                            OpenBoard
                          </Link>
                        )
                      }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <div className="Export__SelectContainer">
                    {this.state.loadingAll && (
                      <CircularProgress
                        size={25}
                        className="Export__SelectContainer--spinner"
                        thickness={7}
                      />
                    )}
                    {!this.state.loadingAll && (
                      <FormControl
                        className="Export__SelectContainer__Select"
                        variant="standard"
                        disabled={this.state.loadingAll}
                      >
                        <InputLabel id="export-all-select-label">
                          {intl.formatMessage(messages.export)}
                        </InputLabel>
                        <Select
                          labelId="export-all-select-label"
                          id="export-all-select"
                          autoWidth={false}
                          value={this.state.exportAllBoard}
                          onChange={this.handleAllBoardChange}
                        >
                          <MenuItem value="cboard">Cboard</MenuItem>
                          <MenuItem value="openboard">OpenBoard</MenuItem>
                          <MenuItem value="pdf">PDF</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </div>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </FullScreenDialog>
      </div>
    );
  }
}

Export.propTypes = propTypes;

export default Export;
