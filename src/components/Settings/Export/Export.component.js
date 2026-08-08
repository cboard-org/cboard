import React, { useCallback, useState } from 'react';
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
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Export.messages';

import './Export.css';
import ListSubheader from '@material-ui/core/ListSubheader';
import {
  LARGE_FONT_SIZE,
  MEDIUM_FONT_SIZE,
  SMALL_FONT_SIZE
} from './Export.constants';

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

function useExportLoading(onExportClick) {
  const [loading, setLoading] = useState(false);

  const trigger = useCallback(
    (format, board, fontSize) => {
      if (!format) return false;
      setLoading(true);
      onExportClick(format, board, fontSize, () => setLoading(false));
      return true;
    },
    [onExportClick]
  );

  return [loading, trigger];
}

function Export({ onClose, boards, intl, onExportClick }) {
  const [exportSingleBoard, setExportSingleBoard] = useState('');
  const [exportAllBoard, setExportAllBoard] = useState('');
  const [labelFontSize, setLabelFontSize] = useState(MEDIUM_FONT_SIZE);
  const [singleBoard, setSingleBoard] = useState('');
  const [boardError, setBoardError] = useState(false);
  const [loadingSingle, triggerSingleExport] = useExportLoading(onExportClick);
  const [loadingAll, triggerAllExport] = useExportLoading(onExportClick);

  const handleBoardChange = event => {
    setBoardError(false);
    setSingleBoard(event.target.value);
  };

  const handleSizeChange = event => {
    setBoardError(false);
    setLabelFontSize(event.target.value);
  };

  const handleSingleBoardChange = event => {
    setExportSingleBoard(event.target.value);
  };

  const handleAllBoardChange = event => {
    setExportAllBoard(event.target.value);
  };

  const handleAllExport = () => {
    triggerAllExport(exportAllBoard, '', labelFontSize);
  };

  const handleSingleExport = () => {
    if (!singleBoard || !exportSingleBoard) {
      setBoardError(true);
      return;
    }
    triggerSingleExport(exportSingleBoard, singleBoard, labelFontSize);
  };

  return (
    <div className="Export">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.export} />}
        onClose={onClose}
      >
        <Paper className="Export__section">
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
                  {loadingSingle ? (
                    <CircularProgress
                      size={25}
                      className="Export__SelectContainer--spinner"
                      thickness={7}
                    />
                  ) : (
                    <div className="Export__SelectContainer">
                      <FormControl
                        className="Export__SelectContainer__Select"
                        variant="standard"
                        error={boardError}
                        disabled={loadingSingle || undefined}
                      >
                        <InputLabel id="boards-select-label">
                          {intl.formatMessage(messages.boards)}
                        </InputLabel>
                        <Select
                          labelId="boards-select-label"
                          id="boards-select"
                          autoWidth={false}
                          value={singleBoard}
                          onChange={handleBoardChange}
                        >
                          {boards.map(
                            board =>
                              !board.hidden && (
                                <MenuItem key={board.id} value={board}>
                                  {board.name ||
                                    (board.nameKey &&
                                      intl.formatMessage({
                                        id: board.nameKey
                                      }))}
                                </MenuItem>
                              )
                          )}
                        </Select>
                      </FormControl>
                      <FormControl
                        className="Export__SelectContainer__Select"
                        variant="standard"
                        disabled={loadingSingle || undefined}
                      >
                        <InputLabel id="export-single-select-label">
                          {intl.formatMessage(messages.export)}
                        </InputLabel>
                        <Select
                          labelId="export-single-select-label"
                          id="export-single-select"
                          autoWidth={false}
                          disabled={loadingSingle || undefined}
                          value={exportSingleBoard}
                          onChange={handleSingleBoardChange}
                        >
                          <MenuItem value="cboard">Cboard</MenuItem>
                          <MenuItem value="openboard">OpenBoard</MenuItem>
                          <MenuItem value="pdf">PDF</MenuItem>
                          <MenuItem value="picsee_pdf">PicseePal PDF</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSingleExport}
                        disabled={
                          !singleBoard || !exportSingleBoard || loadingSingle
                        }
                        startIcon={<GetAppIcon />}
                      >
                        <FormattedMessage {...messages.export} />
                      </Button>
                    </div>
                  )}
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
        <Paper className="Export__section">
          <List>
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
                  {loadingAll ? (
                    <CircularProgress
                      size={25}
                      className="Export__SelectContainer--spinner"
                      thickness={7}
                    />
                  ) : (
                    <div className="Export__SelectContainer">
                      <FormControl
                        className="Export__SelectContainer__Select"
                        variant="standard"
                        disabled={loadingAll}
                      >
                        <InputLabel id="export-all-select-label">
                          {intl.formatMessage(messages.export)}
                        </InputLabel>
                        <Select
                          labelId="export-all-select-label"
                          id="export-all-select"
                          autoWidth={false}
                          value={exportAllBoard}
                          onChange={handleAllBoardChange}
                        >
                          <MenuItem value="cboard">Cboard</MenuItem>
                          <MenuItem value="openboard">OpenBoard</MenuItem>
                          <MenuItem value="pdf">PDF</MenuItem>
                          <MenuItem value="picsee_pdf">PicseePal PDF</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAllExport}
                        disabled={!exportAllBoard || loadingAll}
                        startIcon={<GetAppIcon />}
                      >
                        <FormattedMessage {...messages.export} />
                      </Button>
                    </div>
                  )}
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
        <Paper className="Export__section">
          <List
            className="Export__List"
            subheader={
              <ListSubheader>
                <FormattedMessage {...messages.pdfSettings} />
              </ListSubheader>
            }
          >
            <ListItem>
              <ListItemText
                className="Export__ListItemText"
                primary={<FormattedMessage {...messages.fontSize} />}
                secondary={<FormattedMessage {...messages.fontSizeSecondary} />}
              />
              <ListItemSecondaryAction>
                <div className="Export__SelectContainer">
                  <FormControl
                    className="Export__SelectContainer__Select"
                    variant="standard"
                  >
                    <InputLabel id="export-all-select-label-size">
                      {intl.formatMessage(messages.fontSize)}
                    </InputLabel>
                    <Select
                      labelId="export-all-select-label-size"
                      id="export-all-select-size"
                      autoWidth={false}
                      value={labelFontSize}
                      onChange={handleSizeChange}
                    >
                      <MenuItem value={SMALL_FONT_SIZE}>
                        <FormattedMessage {...messages.small} />
                      </MenuItem>
                      <MenuItem value={MEDIUM_FONT_SIZE}>
                        <FormattedMessage {...messages.medium} />
                      </MenuItem>
                      <MenuItem value={LARGE_FONT_SIZE}>
                        <FormattedMessage {...messages.large} />
                      </MenuItem>
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

Export.propTypes = propTypes;

export default Export;
