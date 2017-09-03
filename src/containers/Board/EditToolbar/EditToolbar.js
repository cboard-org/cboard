import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './EditToolbar.css';

function EditToolbar(props) {
  const { className, children } = props;

  return (
    <div className={classNames(className, 'EditToolbar')}>
      {children}
    </div>
  );
}

EditToolbar.propTypes = {
  className: PropTypes.string
};

EditToolbar.defaultProps = {
  className: ''
};

export default EditToolbar;
