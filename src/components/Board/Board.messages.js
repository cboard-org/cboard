import { defineMessages } from 'react-intl';

export default defineMessages({
  tilesDeleted: {
    id: 'cboard.components.Board.tilesDeleted',
    defaultMessage: 'Tiles deleted'
  },
  tilesCreated: {
    id: 'cboard.components.Board.tilesCreated',
    defaultMessage: 'Tiles created'
  },
  clicksToUnlock: {
    id: 'cboard.components.Board.clicksToUnlock',
    defaultMessage: 'clicks to unlock'
  },
  scannerHowToDeactivate: {
    id: 'cboard.components.Board.scannerHowToDeactivate',
    defaultMessage: 'Press Escape 4 times to deactivate Scanner.'
  },
  scannerManualStrategy: {
    id: 'cboard.components.Board.scannerManualStrategy',
    defaultMessage:
      'Scanner advances with space bar key, press enter to select an item.'
  },
  scannerAutomaticStrategy: {
    id: 'cboard.components.Board.scannerAutomaticStrategy',
    defaultMessage:
      'Scanner will iterate over elements, press any key to select them.'
  }
});
