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
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * @ignore
   */
  classes: PropTypes.object,
  /**
   * Direction
   */
  dir: PropTypes.string,
  /**
   * Values to output
   */
  values: PropTypes.array,
  /**
   * Callback fired when clicking on output container
   */
  onClick: PropTypes.func.isRequired,
  /**
   * Callback fied when clicking on backspace button
   */
  onBackspaceClick: PropTypes.func.isRequired,
  /**
   * Callback fired when clicking on clear button
   */
  onClearClick: PropTypes.func.isRequired
};

SymbolOutput.defaultProps = {
  values: []
};

const invertDir = dir => (dir === 'rtl' ? 'ltr' : 'rtl');

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

export function SymbolOutput({
  className,
  classes,
  dir,
  values,
  onClick,
  onClearClick,
  onBackspaceClick
}) {
  return (
    <div className={classNames('SymbolOutput', className)}>
      <div
        className="SymbolOutput__scroll-container"
        onClick={onClick}
        onKeyDown={e => {
          if (e.keyCode === keycode('enter')) {
            onClick();
          }
        }}
        style={{ direction: invertDir(dir) }}
        tabIndex={values.length ? '0' : '-1'}
      >
        <div className="SymbolOutput__values" style={{ direction: dir }}>
          {values.map(({ label, img }, index) => (
            <div className="Value" key={index}>
              <Symbol label={<FormattedMessage id={label} />} img={img} />
            </div>
          ))}
        </div>
      </div>

      <IconButton
        className={classNames('SymbolOutput__backspace', classes.button)}
        onClick={onClearClick}
        style={{ visibility: values.length ? 'visible' : 'hidden' }}
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
