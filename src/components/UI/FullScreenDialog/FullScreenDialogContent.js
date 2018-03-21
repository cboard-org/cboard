import React from 'react';
import classNames from 'classnames';

function FullScreenDialogContent({ className, children }) {
  const fullScreenDialogContentClassName = classNames(
    'FullScreenDialogContent',
    className
  );
  return <div className={fullScreenDialogContentClassName}>{children}</div>;
}

export { FullScreenDialogContent };
