import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

import TonalChip from '../../../UI/TonalChip';
import { getBoardStatusItems } from './boardStatusItems';

const TONES = {
  public: 'success',
  private: 'neutral',
  root: 'primary',
  active: 'secondary'
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5)
  }
}));

/**
 * Labelled counterpart to BoardStatusIcons, for surfaces with room for words.
 * A bare glyph only carries meaning through a tooltip, which a keyboard user
 * never reaches on a non-focusable <svg>.
 */
const BoardStatusChips = ({
  intl,
  board,
  isRoot,
  isActive,
  showVisibility,
  className
}) => {
  const classes = useStyles();
  const items = getBoardStatusItems(intl, {
    isPublic: board.isPublic,
    isRoot,
    isActive,
    showVisibility
  });

  if (!items.length) {
    return null;
  }

  return (
    <div className={`${classes.root} ${className || ''}`.trim()}>
      {items.map((item) => (
        <TonalChip
          key={item.key}
          tone={TONES[item.tone]}
          icon={item.icon}
          label={item.label}
          title={item.title}
        />
      ))}
    </div>
  );
};

BoardStatusChips.defaultProps = {
  isRoot: false,
  isActive: false,
  showVisibility: true
};

BoardStatusChips.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  isRoot: PropTypes.bool,
  isActive: PropTypes.bool,
  showVisibility: PropTypes.bool,
  className: PropTypes.string
};

export default BoardStatusChips;
