import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import { SECTIONS } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

// Message keys resolved at render time (react-intl is auto-mocked in tests, so
// the imported `messages` object is undefined there — avoid top-level access).
const SECTION_LABELS = {
  [SECTIONS.MY_COMMUNICATOR]: {
    title: 'sectionMyCommunicator',
    hint: 'sectionMyCommunicatorHint'
  },
  [SECTIONS.MY_BOARDS]: {
    title: 'sectionMyBoards',
    hint: 'sectionMyBoardsHint'
  },
  [SECTIONS.COMMUNITY]: {
    title: 'sectionCommunity',
    hint: 'sectionCommunityHint'
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    padding: theme.spacing(2, 0, 1)
  },
  titleBlock: {
    flex: 1,
    minWidth: 0
  },
  hint: {
    color: theme.palette.text.secondary
  }
}));

const SectionHeader = ({ intl, section, total }) => {
  const classes = useStyles();
  const meta = SECTION_LABELS[section];

  return (
    <div className={classes.root}>
      <div className={classes.titleBlock}>
        <Typography variant="h6" component="h2">
          {intl.formatMessage(messages[meta.title])}
        </Typography>
        <Typography variant="body2" className={classes.hint}>
          {intl.formatMessage(messages[meta.hint])}
        </Typography>
      </div>
      <Chip
        size="small"
        label={intl.formatMessage(messages.boardsQty, { qty: total })}
      />
    </div>
  );
};

SectionHeader.propTypes = {
  intl: intlShape.isRequired,
  section: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired
};

export default SectionHeader;
