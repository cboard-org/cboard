import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import messages from './SelectedCounter.messages';
import './SelectedCounter.css';

const propTypes = {
  checked: PropTypes.bool,
  count: PropTypes.number,
  onToggleSelectAll: PropTypes.func
};

const defaultProps = {
  count: 0
};

const SelectedCounter = ({ checked, count, onToggleSelectAll }) => (
  <FormControlLabel
    className="SelectedCounter"
    control={<Checkbox checked={checked} onChange={onToggleSelectAll} />}
    label={
      <Fragment>
        {count} <FormattedMessage {...messages.items} />
      </Fragment>
    }
  />
);

SelectedCounter.propTypes = propTypes;
SelectedCounter.defaultProps = defaultProps;

export default SelectedCounter;
