import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';

import Symbol from '../../Symbol';
import BackspaceButton from './BackspaceButton';
import ClearButton from './ClearButton';
import CopyButton from './CopyButton';
import Scroll from './Scroll';
import './SymbolOutput.css';

class SymbolOutput extends PureComponent {
  static propTypes = {
    /**
     * Symbols to output
     */
    symbols: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Image to display
         */
        image: PropTypes.string,
        /**
         * Label to display
         */
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
      })
    )
  };

  static defaultProps = {
    symbols: []
  };

  render() {
    const {
      onBackspaceClick,
      onClearClick,
      onCopyClick,
      onRemoveClick,
      symbols,
      navigationSettings,
      ...other
    } = this.props;

    const clearButtonStyle = {
      visibility: symbols.length ? 'visible' : 'hidden'
    };

    const copyButtonStyle = {
      visibility: symbols.length ? 'visible' : 'hidden'
    };

    const removeButtonStyle = {
      visibility: navigationSettings.removeOutputActive ? 'visible' : 'hidden'
    };

    const backspaceButtonStyle = {
      visibility: navigationSettings.removeOutputActive ? 'hidden' : 'visible'
    };

    return (
      <div className="SymbolOutput">
        <Scroll {...other}>
          {symbols.map(({ image, label }, index) => (
            <div className="SymbolOutput__value" key={index}>
              <Symbol
                className="SymbolOutput__symbol"
                image={image}
                label={label}
                labelpos="Below"
              />
              <div className="SymbolOutput__value__IconButton">
                <IconButton
                  color="inherit"
                  size={'small'}
                  onClick={onRemoveClick(index)}
                  disabled={!navigationSettings.removeOutputActive}
                  style={removeButtonStyle}
                >
                  <ClearIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </Scroll>
        {navigationSettings.copyShowActive && (
          <CopyButton
            color="inherit"
            onClick={onCopyClick}
            style={copyButtonStyle}
            hidden={!symbols.length}
          />
        )}
        <ClearButton
          color="inherit"
          onClick={onClearClick}
          style={clearButtonStyle}
          hidden={!symbols.length}
        />
        {!navigationSettings.removeOutputActive && (
          <BackspaceButton
            color="inherit"
            onClick={onBackspaceClick}
            style={backspaceButtonStyle}
            hidden={navigationSettings.removeOutputActive}
          />
        )}
      </div>
    );
  }
}

export default SymbolOutput;
