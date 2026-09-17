import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Scannable } from 'react-scannable';

const messages = defineMessages({
  previous: {
    id: 'cboard.components.Board.pagination.previous',
    defaultMessage: 'Previous page'
  },
  next: {
    id: 'cboard.components.Board.pagination.next',
    defaultMessage: 'Next page'
  },
  status: {
    id: 'cboard.components.Board.pagination.status',
    defaultMessage: 'Page {page} of {pages}'
  }
});

export default function BoardPagination({ page, pageCount, onChange }) {
  return (
    <div className="BoardPagination">
      <Scannable disabled={page === 0}>
        <Button
          variant="contained"
          disabled={page === 0}
          onClick={() => onChange(page - 1)}
        >
          <FormattedMessage {...messages.previous} />
        </Button>
      </Scannable>
      <span role="status" aria-live="polite" aria-atomic="true">
        <FormattedMessage
          {...messages.status}
          values={{ page: page + 1, pages: pageCount }}
        />
      </span>
      <Scannable disabled={page === pageCount - 1}>
        <Button
          variant="contained"
          disabled={page === pageCount - 1}
          onClick={() => onChange(page + 1)}
        >
          <FormattedMessage {...messages.next} />
        </Button>
      </Scannable>
    </div>
  );
}
BoardPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};
