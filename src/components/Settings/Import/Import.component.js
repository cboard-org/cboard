import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Import.messages';

import './Import.css';
import { requestCvaPermissions, isCordova } from '../../../cordova-util';

const propTypes = {
  /**
   * Callback fired when clicking the import Cboard button
   */
  onImportClick: PropTypes.func.isRequired,
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func
};

class Import extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  onImportClick(event) {
    const doneCallback = () => {
      this.setState({ loading: false });
    };

    // https://reactjs.org/docs/events.html#event-pooling
    event.persist();

    this.setState({ loading: true, exportMenu: null }, () => {
      this.props.onImportClick(event, doneCallback);
    });
  }

  render() {
    const { onClose } = this.props;
    if (isCordova()) {
      requestCvaPermissions();
    }

    return (
      <div className="Import">
        <FullScreenDialog
          open
          title={<FormattedMessage {...messages.import} />}
          onClose={onClose}
        >
          <Paper>
            <List>
              <ListItem className="Import__ListItem">
                <ListItemText
                  className="Import__ListItemText"
                  primary={<FormattedMessage {...messages.import} />}
                  secondary={
                    <FormattedMessage
                      {...messages.importSecondary}
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
                  <div className="Import__ButtonContainer">
                    {this.state.loading && (
                      <CircularProgress
                        size={25}
                        className="Import__ButtonContainer--spinner"
                        thickness={7}
                      />
                    )}
                    <Button
                      id="import-button"
                      variant="contained"
                      color="primary"
                      component="span"
                      disabled={this.state.loading}
                    >
                      <label htmlFor="file">
                        <FormattedMessage {...messages.import} />
                      </label>
                      <input
                        id="file"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={e => this.onImportClick(e)}
                      />
                    </Button>
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

Import.propTypes = propTypes;

export default Import;
