import * as React from 'react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import './GooglePhotosSearchGallery.css';

const getCols = proportionData => {
  const proportion = proportionData.width / proportionData.height;
  if (proportion <= 1.2) return 1;
  return 2;
};

const GooglePhotosSearchGallery = props => {
  const bigScreen = useMediaQuery('(min-width:600px)');

  return (
    <div className={'root'}>
      <GridList
        cellHeight={bigScreen ? 250 : 180}
        className={'gridList'}
        cols={bigScreen ? 6 : 3}
      >
        {props.imagesData.map(tile =>
          tile.mimeType.search('video') ? ( //prevent loads of videos
            <GridListTile
              onClick={() => {
                props.onSelect(tile.baseUrl);
              }}
              key={tile.id}
              cols={getCols(tile.mediaMetadata)}
            >
              <img src={`${tile.baseUrl}=w2048-h1024`} alt={tile.filename} />
            </GridListTile>
          ) : null
        )}
      </GridList>
    </div>
  );
};

export default GooglePhotosSearchGallery;
