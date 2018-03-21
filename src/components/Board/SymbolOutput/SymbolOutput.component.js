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

export class SymbolOutput extends PureComponent {
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
        /**
         * Label to display
         */
        label: PropTypes.string,
        /**
         * Vocalization text
         */
        vocalization: PropTypes.string,
        /**
         * Image source path
         */
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
    classes: {},
    values: []
  };

  outputPop() {
    const [...values] = this.props.values;
    values.pop();
    return values;
  }

  handleOutputClick = () => {
    const { values, onClick } = this.props;
    onClick(values);
  };

  handleOutputKeyDown = event => {
    const { output, onClick } = this.props;
    if (event.keyCode === keycode('enter')) {
      onClick(output);
    }
  };

  handleClearClick = () => {
    const { onChange } = this.props;
    const output = [];
    onChange(output);
  };

  handleBackspaceClick = () => {
    const { onChange } = this.props;
    const output = this.outputPop();
    onChange(output);
  };

  render() {
    const { className, classes, dir, values } = this.props;

    return (
      <div className={classNames('SymbolOutput', className)}>
        <div
          className="SymbolOutput__scroll-container"
          tabIndex={values.length ? '0' : '-1'}
          onClick={this.handleOutputClick}
          onKeyDown={this.handleOutputKeyDown}
          style={{ direction: invertDir(dir) }}
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
          aria-label="Clear"
          className={classNames('SymbolOutput__clear', classes.button)}
          onClick={this.handleClearClick}
          style={{ visibility: values.length ? 'visible' : 'hidden' }}
        >
          <ClearIcon className={classes.icon} />
        </IconButton>
        <IconButton
          aria-label="Backspace"
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
