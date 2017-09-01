import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import BackspaceIcon from 'material-ui-icons/Backspace';
import ClearIcon from 'material-ui-icons/Clear';
import classNames from 'classnames';

import './Output.css';

const styles = {
  button: {
    height: '64px',
    width: '64px'
  },
  icon: {
    height: '32px',
    width: '32px'
  }
};

export function Output(props) {
  const {
    values,
    onClick,
    onBackspaceClick,
    onClearClick,
    classes,
    dir,
    intl,
    className
  } = props;

  const scrollDir = dir === 'ltr' ? 'rtl' : 'ltr';

  const symbols = values.map(({ label, img }, index) => {
    return (
      <div className="Value" key={index}>
        <div className="Value__container">
          <img className="Value__image" src={img} alt=""/>
        </div>
        <div className="Value__label">
          {intl.formatMessage({ id: label })}
        </div>
      </div>
    );
  });

  return (
    <div className={classNames(className, 'Output')}>
      <div
        className="Output__scroll"
        onClick={onClick}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            onClick();
          }
        }}
        style={{ direction: scrollDir }}
        tabIndex="0"
      >
        <div className="Output__values" style={{ direction: dir }}>
          {symbols}
        </div>
      </div>

       <IconButton
        className={classNames(classes.button, 'Output__backspace')}
        style={{ visibility: symbols.length ? 'visible' : 'hidden' }}
        onClick={onClearClick}
      >
        <ClearIcon className={classes.icon}/>
      </IconButton>
      <IconButton
        className={classNames(classes.button, 'Output__backspace')}
        onClick={onBackspaceClick}
      >
        <BackspaceIcon className={classes.icon}/>
      </IconButton>
    </div>
  );
}

Output.propTypes = {
  values: PropTypes.array,
  onClick: PropTypes.func,
  onBackspaceClick: PropTypes.func,
  className: PropTypes.string
};

Output.defaultProps = {
  values: [],
  onBackspaceClick: () => {
  },
  className: ''
};

export default injectIntl(withStyles(styles, { name: 'Output' })(Output));
