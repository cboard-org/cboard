import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import keycode from 'keycode';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import BackspaceIcon from 'material-ui-icons/Backspace';
import ClearIcon from 'material-ui-icons/Clear';

import Symbol from '../../Symbol';
import './SymbolOutput.css';

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

class SymbolOutput extends PureComponent {
  static propTypes = {
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
    values: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        vocalization: PropTypes.string,
        img: PropTypes.string
      })
    ),
    /**
     * Callback fired when clicking on output container
     */
    onClick: PropTypes.func.isRequired,
    /**
     * Callback fied when clicking on backspace button
     */
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    values: []
  };

  outputPop() {
    const [...values] = this.props.values;
    values.pop();
    return values;
  }

  handleClick = button => {
    const { output, onClick } = this.props;
    onClick(output);
  };

  handleClearClick = () => {
    const { onChange } = this.props;
    const output = [];
    this.setState({ output });
    onChange(output);
  };

  handleBackspaceClick = () => {
    const { onChange } = this.props;
    const output = this.outputPop();
    onChange(output);
  };

  render() {
    const { className, classes, dir, values, onClick } = this.props;

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
                <Symbol label={label} img={img} />
              </div>
            ))}
          </div>
        </div>

        <IconButton
          className={classNames('SymbolOutput__backspace', classes.button)}
          onClick={this.handleClearClick}
          style={{ visibility: values.length ? 'visible' : 'hidden' }}
        >
          <ClearIcon className={classes.icon} />
        </IconButton>
        <IconButton
          className={classNames('SymbolOutput__backspace', classes.button)}
          onClick={this.handleBackspaceClick}
        >
          <BackspaceIcon className={classes.icon} />
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles, { name: 'SymbolOutput' })(SymbolOutput);
