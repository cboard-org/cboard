import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import List, { ListItem, ListItemText } from 'material-ui/List';
import CheckIcon from 'material-ui-icons/Check';

import ISO6391 from 'iso-639-1';
import { changeLocaleAndVoice } from '../../App/actions';
import FullScreenDialog from '../../../components/FullScreenDialog';
import messages from './messages';

export class Language extends Component {
  constructor(props) {
    super(props);

    const { locale } = this.props;
    this.state = { selectedLocale: locale };
  }

  reset() {
    const { locale } = this.props;
    this.setState({ selectedLocale: locale });
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    this.reset();
    onCancel();
  };

  handleSubmit = () => {
    const { onLocaleChange } = this.props;
    onLocaleChange(this.state.selectedLocale);
  };

  handleLocaleClick = locale => {
    this.setState({ selectedLocale: locale });
  };

  sortLocales(locale, [...locales] = []) {
    const localeIndex = locales.indexOf(locale);
    if (localeIndex >= 0) {
      const temp = locales[0];
      locales[0] = locales[localeIndex];
      locales[localeIndex] = temp;
    }
    return locales;
  }

  render() {
    const { open, locale, locales } = this.props;
    const sortedLocales = this.sortLocales(locale, locales);

    const listItems = sortedLocales.map((locale, index) => {
      return (
        <ListItem
          button
          divider
          onClick={this.handleLocaleClick.bind(null, locale)}
          key={index}
          disableRipple
        >
          <ListItemText
            primary={ISO6391.getNativeName(locale)}
            secondary={<FormattedMessage {...messages[locale]} />}
          />
          {this.state.selectedLocale === locale && <CheckIcon />}
        </ListItem>
      );
    });

    return (
      <FullScreenDialog
        open={open}
        title={<FormattedMessage {...messages.language} />}
        onCancel={this.handleCancel}
        onSubmit={this.handleSubmit}
      >
        <List>
          {listItems}
        </List>
      </FullScreenDialog>
    );
  }
}

Language.propTypes = {
  locale: PropTypes.string.isRequired,
  locales: PropTypes.array,
  onLocaleChange: PropTypes.func
};

const mapStateToProps = state => {
  return {
    locale: state.language.locale,
    locales: state.language.locales
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    onLocaleChange: locale => {
      dispatch(changeLocaleAndVoice(locale));
    },
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Language);
