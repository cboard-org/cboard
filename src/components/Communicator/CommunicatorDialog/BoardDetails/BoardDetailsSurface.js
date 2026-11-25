import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';

import { ItemDetailsSurface } from '../../../UI/Dashboard';
import BoardStatusChips from '../shared/BoardStatusChips';
import { formatBoardLocale } from '../utils/boardLocale';
import messages from '../CommunicatorDialog.messages';

const BoardDetailsSurface = ({
  intl,
  board,
  actions,
  busy,
  communicator,
  activeBoardId,
  onClose
}) => (
  <ItemDetailsSurface
    selectedKey={board ? board.id : null}
    label={intl.formatMessage(messages.boardDetails)}
    emptyMessage={intl.formatMessage(messages.selectBoardPrompt)}
    title={board ? board.name || board.id : undefined}
    meta={
      board
        ? [
            intl.formatMessage(messages.tilesQty, { qty: board.tiles.length }),
            formatBoardLocale(intl, board.locale),
            moment(board.lastEdited).format('DD/MM/YYYY')
          ]
        : []
    }
    chips={
      board &&
      communicator && (
        <BoardStatusChips
          intl={intl}
          board={board}
          isRoot={communicator.rootBoard === board.id}
          isActive={activeBoardId === board.id}
        />
      )
    }
    thumb={board ? { src: board.caption, alt: board.name || '' } : {}}
    actions={actions}
    busy={busy}
    onClose={onClose}
  />
);

BoardDetailsSurface.defaultProps = {
  actions: [],
  busy: false
};

BoardDetailsSurface.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object,
  actions: PropTypes.array,
  busy: PropTypes.bool,
  communicator: PropTypes.object,
  activeBoardId: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default BoardDetailsSurface;
