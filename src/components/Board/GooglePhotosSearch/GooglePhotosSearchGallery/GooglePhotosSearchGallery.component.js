import * as React from 'react';
import { ImageList, ImageListItem } from '@material-ui/core'; //insta MUI dependency to avoid white space

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
      <ImageList
        variant="masonry"
        gap={8}
        rowHeight={bigScreen ? 250 : 180}
        className={'gridList'}
        cols={bigScreen ? 6 : 3}
      >
        {props.imagesData.map(tile => (
          <ImageListItem
            onClick={() => {
              props.onSelect(tile.baseUrl);
            }}
            key={tile.id}
            cols={getCols(tile.mediaMetadata)}
          >
            <img
              src={`${tile.baseUrl}?w=248&fit=crop&auto=format`}
              srcSet={`${tile.baseUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={tile.filename}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default GooglePhotosSearchGallery;
