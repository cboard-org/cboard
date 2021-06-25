import * as React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import './GooglePhotosSearchGallery.css';

const getCols = proportionData => {
  const proportion = proportionData.width / proportionData.height;
  if (proportion <= 1.2) return 1;
  return 2;
};

const GooglePhotosSearchGallery = props => {
  return (
    <div className={'root'}>
      <GridList cellHeight={250} className={'gridList'} cols={6}>
        {props.imagesData.map(tile => (
          <GridListTile
            onClick={() => {
              props.onSelect(tile.baseUrl);
            }}
            key={tile.id}
            cols={getCols(tile.mediaMetadata)}
          >
            <img src={`${tile.baseUrl}=w2048-h1024`} alt={tile.filename} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

export default GooglePhotosSearchGallery;
