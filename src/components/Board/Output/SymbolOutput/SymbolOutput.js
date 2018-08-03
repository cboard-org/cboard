import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Symbol from '../../Symbol';
import BackspaceButton from './BackspaceButton';
import ClearButton from './ClearButton';
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
    const { onBackspaceClick, onClearClick, symbols, ...other } = this.props;

    const clearButtonStyle = {
      visibility: symbols.length ? 'visible' : 'hidden'
    };

    return (
      <div className="SymbolOutput">
        <Scroll {...other}>
          {symbols.map(({ image, label }, index) => (
            <div className="SymbolOutput__value" key={index}>
              <Symbol image={image} label={label} />
            </div>
          ))}
        </Scroll>

        <ClearButton onClick={onClearClick} style={clearButtonStyle} />
        <BackspaceButton onClick={onBackspaceClick} />
      </div>
    );
  }
}

export default SymbolOutput;
