import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Symbol from '../Symbol';
import './BoardButton.css';

class BoardButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    id: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    vocalization: PropTypes.string,
    img: PropTypes.string,
    boardId: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {};

  render() {
    const {
      className,
      children,
      id,
      type,
      label,
      vocalization,
      img,
      boardId,
      onClick
    } = this.props;

    const button = { id, type, label, vocalization, img, boardId };

    const symbol = {
      label: <FormattedMessage id={label} />,
      img
    };

    const boardButtonClassName = classNames(className, {
      BoardButton: true,
      'BoardButton--folder': type === 'folder'
    });

    return (
      <button
        className={boardButtonClassName}
        onClick={() => {
          onClick(button);
        }}
      >
        <Symbol {...symbol} />
        {children}
      </button>
    );
  }
}

export default BoardButton;
