import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Symbols.messages';
import './Symbols.css';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  updateSymbolsSettings: PropTypes.func
};

class Symbols extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.symbolsSettings
    };
  }

  toggleArasaacSymbols = () => {
    this.setState({
      active: !this.state.arasaacActive
    });
  };

  onSubmit = () => {
    this.props.updateSymbolsSettings(this.state);
  };

  render() {
    const { onClose } = this.props;
    return (
      <div className="Symbols">
        <FullScreenDialog
          open
          title={<FormattedMessage {...messages.symbols} />}
          onClose={onClose}
          onSubmit={this.onSubmit}
        >
          <Paper>
            <List>
              <ListItem>
                <ListItemText
                  className="Symbols__ListItemText"
                  primary={<FormattedMessage {...messages.downloadArasaac} />}
                  secondary={
                    <FormattedMessage {...messages.downloadArasaacSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.arasaacActive}
                    onChange={this.toggleArasaacSymbols}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <div className="Symbols__HelpText">
              <div>
                <FormattedMessage {...messages.symbolsArasaacHelp} />
              </div>
            </div>
          </Paper>
        </FullScreenDialog>
      </div>
    );
  }
}

Symbols.propTypes = propTypes;

export default Symbols;
