import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import { ItemCard } from '../../../UI/Dashboard';
import BoardStatusIcons from '../shared/BoardStatusIcons';
import { formatBoardLocale } from '../utils/boardLocale';
import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles((theme) => ({
  star: {
    minWidth: 44,
    minHeight: 44
  },
  starActive: {
    color: theme.palette.type === 'dark' ? orange[300] : orange[900]
  }
}));

const BoardCard = ({
  intl,
  board,
  communicator,
  activeBoardId,
  selected,
  busy,
  onSelect,
  onToggleQuickAccess,
  showQuickAccess,
  registerTrigger
}) => {
  const classes = useStyles();
  const locale = formatBoardLocale(intl, board.locale);
  const isRoot = communicator.rootBoard === board.id;
  const inQuickAccess = communicator.boards.includes(board.id);
  const toggleLabel = intl.formatMessage(
    inQuickAccess ? messages.removeFromQuickAccess : messages.addToQuickAccess
  );

  const handleToggle = (event) => {
    // The whole card is an activation target; the star must not select it.
    event.stopPropagation();
    onToggleQuickAccess(board);
  };

  return (
    <ItemCard
      title={board.name || board.id}
      meta={[
        intl.formatMessage(messages.tilesQty, { qty: board.tiles.length }),
        locale
      ]}
      caption={moment(board.lastEdited).format('DD/MM/YYYY')}
      thumb={{ src: board.caption, alt: board.name || '' }}
      accented={isRoot || activeBoardId === board.id}
      selected={selected}
      busy={busy}
      onSelect={() => onSelect(board.id)}
      buttonRef={(node) => registerTrigger(board.id, node)}
      status={
        <BoardStatusIcons
          intl={intl}
          board={board}
          communicator={communicator}
          activeBoardId={activeBoardId}
        />
      }
      action={
        showQuickAccess && (
          <Tooltip title={toggleLabel}>
            <span>
              <IconButton
                size="small"
                data-testid="quick-access-toggle"
                className={classNames(classes.star, {
                  [classes.starActive]: inQuickAccess
                })}
                aria-label={toggleLabel}
                aria-pressed={inQuickAccess}
                disabled={isRoot && inQuickAccess}
                onClick={handleToggle}
              >
                {inQuickAccess ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </span>
          </Tooltip>
        )
      }
    />
  );
};

BoardCard.defaultProps = {
  selected: false,
  busy: false,
  showQuickAccess: true
};

BoardCard.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  communicator: PropTypes.object.isRequired,
  activeBoardId: PropTypes.string,
  selected: PropTypes.bool,
  busy: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onToggleQuickAccess: PropTypes.func.isRequired,
  showQuickAccess: PropTypes.bool,
  registerTrigger: PropTypes.func.isRequired
};

export default BoardCard;
