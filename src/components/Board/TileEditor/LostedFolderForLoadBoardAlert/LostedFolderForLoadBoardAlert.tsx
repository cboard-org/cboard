import * as React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import messages from '../TileEditor.messages';

export interface LostedFolderForLoadBoardAlertProps {
  intl: {
    formatMessage: (
      message: { id: string; defaultMessage?: string; description?: string },
    ) => string;
  };
}

export const LostedFolderForLoadBoardAlert: React.FC<
  LostedFolderForLoadBoardAlertProps
> = ({ intl }) => {
  return (
    <Alert className="TileEditor__loadBoard_Alert" severity="warning">
      <AlertTitle>
        {intl.formatMessage(messages.loadBoardAlertTitle)}
      </AlertTitle>
      {intl.formatMessage(messages.loadBoardAlertDescription)}
    </Alert>
  );
};
