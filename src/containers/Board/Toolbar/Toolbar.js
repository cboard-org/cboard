import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Toolbar.css';

function Toolbar(props) {
  const { title, className, children } = props;

  return (
    <div className={classNames(className, 'Toolbar')}>
      <h2 className="Toolbar__title">
        {title}
      </h2>
      {children}
    </div>
  );
}

Toolbar.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string
};

Toolbar.defaultProps = {
  className: ''
};

export default Toolbar;
