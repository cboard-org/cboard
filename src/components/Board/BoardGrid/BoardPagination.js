import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defineMessages } from 'react-intl';
import { Scannable } from 'react-scannable';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import '../../NavigationButtons/NavigationButtons.css';

const messages = defineMessages({
  previous: {
    id: 'cboard.components.Board.pagination.previous',
    defaultMessage: 'Previous page'
  },
  next: {
    id: 'cboard.components.Board.pagination.next',
    defaultMessage: 'Next page'
  },
  first: {
    id: 'cboard.components.Board.pagination.first',
    defaultMessage: 'First page'
  },
  last: {
    id: 'cboard.components.Board.pagination.last',
    defaultMessage: 'Last page'
  },
  status: {
    id: 'cboard.components.Board.pagination.status',
    defaultMessage: 'Page {page} of {pages}'
  }
});

export default function BoardPagination({ page, pageCount, onChange, intl }) {
  const disabled = pageCount <= 1;
  const buttonClassName = (position) =>
    classNames('SideNavigationButton', position, { disable: disabled });

  return (
    <div className="SideNavigationButtonsContainer BoardPagination">
      <div className={buttonClassName('SideButtonScrollUp')}>
        <Scannable disabled={disabled}>
          <button
            type="button"
            aria-label={intl.formatMessage(
              !disabled && page === 0 ? messages.last : messages.previous
            )}
            disabled={disabled}
            onClick={() => onChange((page - 1 + pageCount) % pageCount)}
          >
            <KeyboardArrowUpIcon />
            <span className="BoardPagination__counter" aria-hidden="true">
              {page + 1} / {pageCount}
            </span>
          </button>
        </Scannable>
      </div>
      <div className={buttonClassName('SideButtonScrollDown')}>
        <Scannable disabled={disabled}>
          <button
            type="button"
            aria-label={intl.formatMessage(
              !disabled && page === pageCount - 1
                ? messages.first
                : messages.next
            )}
            disabled={disabled}
            onClick={() => onChange((page + 1) % pageCount)}
          >
            <KeyboardArrowDownIcon />
          </button>
        </Scannable>
      </div>
      <span
        className="BoardPagination__status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {intl.formatMessage(messages.status, {
          page: page + 1,
          pages: pageCount
        })}
      </span>
    </div>
  );
}
BoardPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};
