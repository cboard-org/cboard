import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const propTypes = {
  increaseOutputButtons: PropTypes.bool,
  bigControlsClassName: PropTypes.string,
  onPlayImprovedPhrase: PropTypes.func
};

function ImprovePhraseControls({
  increaseOutputButtons,
  bigControlsClassName,
  onPlayImprovedPhrase
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div
        className={`SymbolOutput__improved__Phrase__controls ${bigControlsClassName}`}
      >
        <div className="improved__Phrase_shadow" />
        <div className="improved_Phrase_Button">
          <IconButton
            color="inherit"
            className={
              increaseOutputButtons
                ? 'Improved__Phrase__button__lg'
                : 'Output__button__sm'
            }
            onClick={onPlayImprovedPhrase}
          >
            <PlayArrowIcon
              className={
                increaseOutputButtons ? 'Output__icon__lg' : 'Output__icon__sm'
              }
            />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
ImprovePhraseControls.propTypes = propTypes;
ImprovePhraseControls.defaultProps = {};

export default ImprovePhraseControls;
