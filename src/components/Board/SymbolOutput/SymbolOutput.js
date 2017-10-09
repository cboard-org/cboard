import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import keycode from 'keycode';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import BackspaceIcon from 'material-ui-icons/Backspace';
import ClearIcon from 'material-ui-icons/Clear';

import Symbol from '../../Symbol';
import './SymbolOutput.css';

SymbolOutput.propTypes = {
  className: PropTypes.string,
  values: PropTypes.array,
  onClick: PropTypes.func,
  onBackspaceClick: PropTypes.func
};

SymbolOutput.defaultProps = {
  className: '',
  values: [],
  onBackspaceClick: () => {}
};

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

export function SymbolOutput(props) {
  const {
    values,
    onClick,
    onBackspaceClick,
    onClearClick,
    classes,
    dir,
    className
  } = props;

  const scrollDir = dir === 'ltr' ? 'rtl' : 'ltr';

  const symbols = values.map(({ label, img }, index) => {
    return (
      <div className="Value" key={index}>
        <Symbol label={<FormattedMessage id={label} />} img={img} />
      </div>
    );
  });

  return (
    <div className={classNames('SymbolOutput', className)}>
      <div
        className="SymbolOutput__scroll"
        onClick={onClick}
        onKeyDown={e => {
          if (e.keyCode === keycode('enter')) {
            onClick();
          }
        }}
        style={{ direction: scrollDir }}
        tabIndex={values.length ? '0' : '-1'}
      >
        <div className="SymbolOutput__values" style={{ direction: dir }}>
          {symbols}
        </div>
      </div>

      <IconButton
        className={classNames('SymbolOutput__backspace', classes.button)}
        style={{ visibility: symbols.length ? 'visible' : 'hidden' }}
        onClick={onClearClick}
      >
        <ClearIcon className={classes.icon} />
      </IconButton>
      <IconButton
        className={classNames('SymbolOutput__backspace', classes.button)}
        onClick={onBackspaceClick}
      >
        <BackspaceIcon className={classes.icon} />
      </IconButton>
    </div>
  );
}

export default withStyles(styles, { name: 'SymbolOutput' })(SymbolOutput);
