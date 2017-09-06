import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import BackspaceIcon from 'material-ui-icons/Backspace';
import ClearIcon from 'material-ui-icons/Clear';
import classNames from 'classnames';

import Symbol from '../Symbol';
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
        tabIndex={values.length ? '0' : '-1'}
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
        <ClearIcon className={classes.icon} />
      </IconButton>
      <IconButton
        className={classNames(classes.button, 'Output__backspace')}
        onClick={onBackspaceClick}
      >
        <BackspaceIcon className={classes.icon} />
      </IconButton>
    </div>
  );
}

Output.propTypes = {
  className: PropTypes.string,
  values: PropTypes.array,
  onClick: PropTypes.func,
  onBackspaceClick: PropTypes.func
};

Output.defaultProps = {
  className: '',
  values: [],
  onBackspaceClick: () => {}
};

export default withStyles(styles, { name: 'Output' })(Output);
