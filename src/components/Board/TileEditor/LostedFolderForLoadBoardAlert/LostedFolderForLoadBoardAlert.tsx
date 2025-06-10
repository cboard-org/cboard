import * as React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import messages from '../TileEditor.messages';

export function LostedFolderForLoadBoardAlert({
  intl
}: {
  intl: { formatMessage: (message: string) => string };
}) {
  return (
    <Alert className="TileEditor__loadBoard_Alert" severity="warning">
      <AlertTitle>
        {intl.formatMessage(messages.loadBoardAlertTitle)}
      </AlertTitle>
      {intl.formatMessage(messages.loadBoardAlertDescription)}
    </Alert>
  );
}
