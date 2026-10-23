import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import ItemThumb from './ItemThumb';
import PremiumFeature from '../../PremiumFeature';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 2)
  },
  thumb: {
    width: '100%',
    height: 120,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`
  },
  title: {
    fontWeight: 600
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    color: theme.palette.text.secondary
  },
  separator: {
    margin: theme.spacing(0, 0.75),
    opacity: 0.5
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5)
  },
  action: {
    // Full-width, left-aligned, labelled. Comfortably above the 44px target
    // minimum in both themes.
    justifyContent: 'flex-start',
    minHeight: 44,
    textTransform: 'none'
  },
  destructive: {
    color: theme.palette.error.main
  },
  empty: {
    padding: theme.spacing(4, 2),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  }
}));

const ActionButton = ({ action, busy, classes }) => {
  const button = (
    <Button
      fullWidth
      data-action-key={action.key}
      className={`${classes.action} ${
        action.destructive ? classes.destructive : ''
      }`}
      disabled={!!action.disabled || busy}
      title={action.hint}
      startIcon={action.icon}
      onClick={action.onClick}
    >
      {action.label}
    </Button>
  );

  return action.premium ? <PremiumFeature>{button}</PremiumFeature> : button;
};

ActionButton.propTypes = {
  action: PropTypes.object.isRequired,
  busy: PropTypes.bool,
  classes: PropTypes.object.isRequired
};

const ItemDetails = ({
  empty,
  emptyMessage,
  title,
  meta,
  chips,
  thumb,
  actions,
  busy,
  headingRef,
  hideTitle
}) => {
  const classes = useStyles();

  if (empty) {
    return (
      <div className={classes.empty}>
        <Typography variant="body2">{emptyMessage}</Typography>
      </div>
    );
  }

  const metaParts = meta.filter(Boolean);

  return (
    <div className={classes.root}>
      <ItemThumb
        className={classes.thumb}
        src={thumb.src}
        alt={thumb.alt}
        icon={thumb.icon}
      >
        {thumb.content}
      </ItemThumb>

      <div className={classes.header}>
        {!hideTitle && (
          <Typography
            variant="h6"
            component="h2"
            className={classes.title}
            tabIndex={-1}
            ref={headingRef}
          >
            {title}
          </Typography>
        )}
        <Typography variant="caption" component="p" className={classes.meta}>
          {metaParts.map((part, index) => (
            <React.Fragment key={part}>
              {index > 0 && (
                <span className={classes.separator} aria-hidden="true">
                  ·
                </span>
              )}
              {part}
            </React.Fragment>
          ))}
        </Typography>
        {chips}
      </div>

      <Divider />

      <div className={classes.actions}>
        {actions.map((action) => (
          <ActionButton
            key={action.key}
            action={action}
            busy={busy}
            classes={classes}
          />
        ))}
      </div>
    </div>
  );
};

ItemDetails.defaultProps = {
  empty: false,
  meta: [],
  thumb: {},
  actions: [],
  busy: false,
  hideTitle: false
};

ItemDetails.propTypes = {
  empty: PropTypes.bool,
  emptyMessage: PropTypes.node,
  title: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.string),
  chips: PropTypes.node,
  thumb: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    icon: PropTypes.elementType,
    content: PropTypes.node
  }),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.node,
      hint: PropTypes.string,
      disabled: PropTypes.bool,
      destructive: PropTypes.bool,
      premium: PropTypes.bool,
      onClick: PropTypes.func
    })
  ),
  busy: PropTypes.bool,
  headingRef: PropTypes.object,
  hideTitle: PropTypes.bool
};

export default ItemDetails;
