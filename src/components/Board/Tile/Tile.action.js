import React from 'react';
import PropTypes from 'prop-types';
import Tile from '../Tile';
import Symbol from '../Symbol';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const TileRenderer = ({
  tile,
  isSelected,
  isSelecting,
  isSaving,
  displaySettings,
  onTileClick,
  onTileFocus
}) => {
  const variant = Boolean(tile.loadBoard) ? 'folder' : 'button';
  return (
    <Tile
      backgroundColor={tile.backgroundColor}
      borderColor={tile.borderColor}
      variant={variant}
      onClick={e => {
        e.stopPropagation();
        onTileClick(tile);
      }}
      onFocus={() => {
        onTileFocus(tile.id);
      }}
    >
      <Symbol
        image={tile.image}
        label={tile.label}
        keyPath={tile.keyPath}
        labelpos={displaySettings.labelPosition}
      />
      {isSelecting && !isSaving && (
        <div className="CheckCircle">
          {isSelected && <CheckCircleIcon className="CheckCircle__icon" />}
        </div>
      )}
    </Tile>
  );
};

TileRenderer.propTypes = {
  tile: PropTypes.object,
  isSelected: PropTypes.bool,
  isSelecting: PropTypes.bool,
  isSaving: PropTypes.bool,
  displaySettings: PropTypes.object,
  onTileClick: PropTypes.func,
  onTileFocus: PropTypes.func
};

export default TileRenderer;
