import { defineMessages } from 'react-intl';

export default defineMessages({
  tilesDeleted: {
    id: 'cboard.components.Board.tilesDeleted',
    defaultMessage: 'Tiles deleted'
  },
  rootBoardNotDeleted: {
    id: 'cboard.components.Board.rootBoardNotDeleted',
    defaultMessage: 'Root Board cannot be deleted'
  },
  tilesCreated: {
    id: 'cboard.components.Board.tilesCreated',
    defaultMessage: 'Tiles created'
  },
  boardSavedNotification: {
    id: 'cboard.components.Board.boardSavedNotification',
    defaultMessage: 'Board changes were saved'
  },
  boardNotSavedNotification: {
    id: 'cboard.components.Board.boardNotSavedNotification',
    defaultMessage:
      'There was an error updating your board on the cloud. Check your connection'
  },
  editTitle: {
    id: 'cboard.components.Board.editTitle',
    defaultMessage: 'Edit Board Title'
  },
  boardTitle: {
    id: 'cboard.components.Board.boardTitle',
    defaultMessage: 'Board Title'
  },
  boardEditTitleCancel: {
    id: 'cboard.components.Board.boardEditTitleCancel',
    defaultMessage: 'Cancel'
  },
  boardEditTitleAccept: {
    id: 'cboard.components.Board.boardEditTitleAccept',
    defaultMessage: 'Accept'
  },
  share: {
    id: 'cboard.components.Board.share',
    defaultMessage: 'Share'
  },
  copyMessage: {
    id: 'cboard.components.Board.copyMessage',
    defaultMessage: 'Copied to clipboard!'
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
  },
  userProfileLocked: {
    id: 'cboard.components.Board.userProfileLocked',
    defaultMessage:
      'User Profile is locked, please unlock settings to see your user profile.'
  },
  boardMissed: {
    id: 'cboard.components.Board.boardMissed',
    defaultMessage:
      'We are sorry but we have missed this folder / board. We recommend you to create it again.'
  },
  copyPublicBoardTitle: {
    id: 'cboard.components.Board.copyPublicBoardTitle',
    defaultMessage: 'Do you want to copy a public board?'
  },
  copyPublicBoardDesc: {
    id: 'cboard.components.Board.copyPublicBoardDesc',
    defaultMessage:
      'You are trying to open a public shared board. In order to use and edit this board you have to copy it into your communicator boards.'
  },
  blockedPrivateBoardTitle: {
    id: 'cboard.components.Board.blockedPrivateBoardTitle',
    defaultMessage: 'Private board!'
  },
  blockedPrivateBoardDesc: {
    id: 'cboard.components.Board.blockedPrivateBoardDesc',
    defaultMessage:
      'You are trying to open a private board. In order to use and edit this board you have to ask author to publish the board.'
  },
  boardCopyCancel: {
    id: 'cboard.components.Board.boardCopyCancel',
    defaultMessage: 'Cancel'
  },
  boardCopyAccept: {
    id: 'cboard.components.Board.boardCopyAccept',
    defaultMessage: 'Accept'
  },
  boardCopiedSuccessfully: {
    id: 'cboard.components.Board.boardCopiedSuccessfully',
    defaultMessage: 'Board successfully added to your Communicator.'
  },
  boardCopyError: {
    id: 'cboard.components.Board.boardCopyError',
    defaultMessage: 'ERROR: There was an error trying to get the board.'
  },
  emptyVoiceAlert: {
    id: 'cboard.components.Board.emptyVoiceAlert',
    defaultMessage:
      'WARNING: we did not detect an available Text to Speech voice! Cboard cannot work properly.'
  },
  offlineVoiceAlert: {
    id: 'cboard.components.Board.offlineVoiceAlert',
    defaultMessage:
      'WARNING: you are using an online voice, but it looks you are offline!'
  },
  offlineChangeVoice: {
    id: 'cboard.components.Board.offlineChangeVoice',
    defaultMessage: 'Change voice'
  },
  myBoardTitle: {
    id: 'cboard.components.Board.myBoardTitle',
    defaultMessage: 'My Board'
  },
  noTitle: {
    id: 'cboard.components.CommunicatorDialog.noTitle',
    defaultMessage: 'No title'
  },
  failedToCopy: {
    id: 'cboard.components.Board.failedToCopy',
    defaultMessage: 'Failed to copy to clipboard'
  },
  walkthroughWelcome: {
    id: 'cboard.components.Board.walkthroughWelcome',
    defaultMessage: 'Welcome to Cboard!'
  },
  walkthroughUnlock: {
    id: 'cboard.components.Board.walkthroughUnlock',
    defaultMessage:
      'Press the lock button four times to unlock your options and settings.'
  },
  walkthroughStart: {
    id: 'cboard.components.Board.walkthroughStart',
    defaultMessage:
      'Are you ready for a tour across Cboard app and its awesome features?'
  },
  walkthroughSignInUp: {
    id: 'cboard.components.Board.walkthroughSignInUp',
    defaultMessage: 'Sign in to personalise your communicator.'
  },
  walkthroughEditBoard: {
    id: 'cboard.components.Board.walkthroughEditBoard',
    defaultMessage: 'Use this to edit the current board.'
  },
  walkthroughBoardName: {
    id: 'cboard.components.Board.walkthroughBoardName',
    defaultMessage: 'Here you can change the name of the current board.'
  },
  walkthroughAddTile: {
    id: 'cboard.components.Board.walkthroughAddTile',
    defaultMessage:
      'Here you can add a tile to the board. This tile can be a button, a folder or an empty board.'
  },
  walkthroughChangeBoard: {
    id: 'cboard.components.Board.walkthroughChangeBoard',
    defaultMessage:
      'This is a dropdown menu from where you can go to another board in your communicator.'
  },
  walkthroughBuildCommunicator: {
    id: 'cboard.components.Board.walkthroughBuildCommunicator',
    defaultMessage:
      'Here you can access your communicator, edit it and enrich it with more boards.'
  },
  walkthroughEndTour: {
    id: 'cboard.components.Board.walkthroughEndTour',
    defaultMessage: 'End Tour'
  },
  walkthroughCloseTour: {
    id: 'cboard.components.Board.walkthroughCloseTour',
    defaultMessage: 'Close Tour'
  },
  walkthroughBack: {
    id: 'cboard.components.Board.walkthroughBack',
    defaultMessage: 'Back'
  },
  walkthroughNext: {
    id: 'cboard.components.Board.walkthroughNext',
    defaultMessage: 'Next'
  },
  tilesCopiedSuccessfully: {
    id: 'cboard.components.Board.tilesCopiedSuccessfully',
    defaultMessage: 'Tiles copied successfully.'
  },
  tilesPastedSuccessfully: {
    id: 'cboard.components.Board.tilesPastedSuccessfully',
    defaultMessage: 'Tiles pasted successfully.'
  },
  tilesPastedError: {
    id: 'cboard.components.Board.tilesPastedError',
    defaultMessage: 'WARNING: There was an error on tiles paste.'
  },
  live: {
    id: 'cboard.components.Board.live',
    defaultMessage: 'LIVE'
  },
  writeAndSay: {
    id: 'cboard.components.Board.writeAndSay',
    defaultMessage: 'Write and say'
  }
});
