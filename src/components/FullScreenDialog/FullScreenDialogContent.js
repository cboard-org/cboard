import React from 'react';
import classNames from 'classnames';
import { DialogContent } from 'material-ui/Dialog';

function FullScreenDialogContent({ className, children }) {
  const fullScreenDialogContentClassName = classNames(
    'FullScreenDialogContent',
    className
  );
  return (
    <DialogContent className={fullScreenDialogContentClassName}>
      {children}
    </DialogContent>
  );
}

export { FullScreenDialogContent };
