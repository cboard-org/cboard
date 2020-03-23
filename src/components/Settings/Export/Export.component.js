import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
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
      exportMenu: null,
      loading: false
    };
  }

  openMenu(e) {
    this.setState({ exportMenu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ exportMenu: null });
  }

  onExportClick(type = 'cboard') {
    const doneCallback = () => {
      this.setState({ loading: false });
    };

    this.setState({ loading: true, exportMenu: null }, () => {
      this.props.onExportClick(type, doneCallback);
    });
  }

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
            <List >
              <ListItem className="Export__ListItem">
                <ListItemText
                  className="Export__ListItemText"
                  primary={<FormattedMessage {...messages.exportSingle} />}
                  secondary={
                    <FormattedMessage
                      {...messages.exportSingleSecondary}
                      values={{
                        cboardLink: (
                          <a href="https://www.cboard.io/help/#HowdoIimportaboardintoCboard">
                            Cboard
                          </a>
                        ),
                        link: (
                          <a href="https://www.openboardformat.org/">
                            OpenBoard
                          </a>
                        )
                      }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <div className="Export__SelectContainer">
                    {this.state.loading && (
                      <CircularProgress
                        size={25}
                        className="Export__ButtonContainer--spinner"
                        thickness={7}
                      />
                    )}
                    <FormControl
                      className="Export__SelectContainer__Select"
                      variant="standard" >
                      <InputLabel id="boards-select-label">
                        {intl.formatMessage(messages.boards)}
                      </InputLabel>
                      <Select
                        labelId="boards-select-label"
                        id="boards-select"
                        autoWidth={false}
                        value={this.state.linkedBoard}
                        onChange={this.handleBoardsChange}
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
                      variant="standard" >
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
                        <MenuItem
                          onClick={this.onExportClick.bind(this, 'cboard')}
                        >
                          Cboard
                      </MenuItem>
                        <MenuItem
                          onClick={this.onExportClick.bind(this, 'openboard')}
                        >
                          OpenBoard
                      </MenuItem>
                        <MenuItem onClick={this.onExportClick.bind(this, 'pdf')}>
                          PDF
                      </MenuItem>
                        {/*
                      <MenuItem onClick={this.onExportClick.bind(this, 'image')}>
                        Image
                      </MenuItem>
                      */}

                      </Select>
                    </FormControl>
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
                          <a href="https://www.cboard.io/help/#HowdoIimportaboardintoCboard">
                            Cboard
                          </a>
                        ),
                        link: (
                          <a href="https://www.openboardformat.org/">
                            OpenBoard
                          </a>
                        )
                      }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <div className="Export__ButtonContainer">
                    {this.state.loading && (
                      <CircularProgress
                        size={25}
                        className="Export__ButtonContainer--spinner"
                        thickness={7}
                      />
                    )}
                    <FormControl
                      className="Export__SelectContainer__Select"
                      variant="standard" >
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
                        <MenuItem
                          onClick={this.onExportClick.bind(this, 'cboard')}
                        >
                          Cboard
                      </MenuItem>
                        <MenuItem
                          onClick={this.onExportClick.bind(this, 'openboard')}
                        >
                          OpenBoard
                      </MenuItem>
                        <MenuItem onClick={this.onExportClick.bind(this, 'pdf')}>
                          PDF
                      </MenuItem>
                        {/*
                      <MenuItem onClick={this.onExportClick.bind(this, 'image')}>
                        Image
                      </MenuItem>
                      */}

                      </Select>
                    </FormControl>
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
