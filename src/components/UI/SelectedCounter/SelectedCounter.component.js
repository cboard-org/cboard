import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from 'material-ui';

import messages from './SelectedCounter.messages';
import './SelectedCounter.css';

const propTypes = {
  count: PropTypes.number,
  onChange: PropTypes.func
};

const defaultProps = {
  count: 0
};

const SelectedCounter = ({ count, onChange }) => (
  <div className="SelectedCounter">
    <Checkbox onChange={onChange} />
    <span>
      <FormattedMessage {...messages.items} /> {!!count && `(${count})`}
    </span>
  </div>
);

SelectedCounter.propTypes = propTypes;
SelectedCounter.defaultProps = defaultProps;

export default SelectedCounter;
