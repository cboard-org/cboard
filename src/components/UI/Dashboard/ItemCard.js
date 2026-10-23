import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import ItemThumb from './ItemThumb';
import {
  softRadius,
  surfaceInteractive,
  surfaceAccent,
  busyOverlay
} from './Dashboard.styles';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: softRadius(theme),
    overflow: 'hidden',
    ...surfaceInteractive(theme, { lift: true })
  },
  accent: surfaceAccent(theme),
  selected: {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
  },
  actionArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    // The action area is a <button>, whose UA default centres every line of
    // text inside it — which left the title and date centred while the meta
    // row stayed left, reading as three unrelated blocks.
    textAlign: 'start'
  },
  thumb: {
    height: 132,
    flexShrink: 0
  },
  content: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: theme.spacing(1.5, 1.5),
    '&:last-child': {
      paddingBottom: theme.spacing(1.5)
    },
    '&.MuiCardContent-root': {
      textAlign: 'start'
    }
  },
  title: {
    fontWeight: 600,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  meta: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
    lineHeight: 1.4
  },
  date: {
    color: theme.palette.text.hint,
    marginTop: theme.spacing(0.25),
    lineHeight: 1.4
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 1, 1, 2),
    gap: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`
  },
  footerNoStar: {
    padding: theme.spacing(2)
  },
  busy: busyOverlay(theme)
}));

/**
 * Selectable dashboard card: thumbnail, title, meta lines and a footer with a
 * status slot and an optional action (kept outside the activation area so it
 * never selects the card).
 */
const ItemCard = ({
  title,
  meta,
  caption,
  thumb,
  status,
  action,
  accented,
  selected,
  busy,
  onSelect,
  buttonRef
}) => {
  const classes = useStyles();
  const metaParts = meta.filter(Boolean);

  return (
    <Card
      variant="outlined"
      className={classNames(classes.card, {
        [classes.accent]: accented,
        [classes.selected]: selected
      })}
    >
      {busy && (
        <div className={classes.busy}>
          <CircularProgress size={28} />
        </div>
      )}

      <CardActionArea
        className={classes.actionArea}
        aria-current={selected || undefined}
        ref={buttonRef}
        onClick={onSelect}
      >
        <ItemThumb
          className={classes.thumb}
          src={thumb.src}
          alt={thumb.alt}
          icon={thumb.icon}
        >
          {thumb.content}
        </ItemThumb>
        <CardContent className={classes.content}>
          <Typography
            variant="subtitle1"
            className={classes.title}
            title={title}
          >
            {title}
          </Typography>
          {metaParts.length > 0 && (
            <Typography
              variant="caption"
              className={classes.meta}
              component="p"
            >
              {metaParts.join('  ·  ')}
            </Typography>
          )}
          {caption && (
            <Typography
              variant="caption"
              className={classes.date}
              component="p"
            >
              {caption}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>

      {(status || action) && (
        <div
          className={classNames(classes.footer, {
            [classes.footerNoStar]: !action
          })}
        >
          {status}
          {action}
        </div>
      )}
    </Card>
  );
};

ItemCard.defaultProps = {
  meta: [],
  thumb: {},
  accented: false,
  selected: false,
  busy: false
};

ItemCard.propTypes = {
  title: PropTypes.string.isRequired,
  meta: PropTypes.arrayOf(PropTypes.string),
  caption: PropTypes.string,
  thumb: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    icon: PropTypes.elementType,
    content: PropTypes.node
  }),
  status: PropTypes.node,
  action: PropTypes.node,
  accented: PropTypes.bool,
  selected: PropTypes.bool,
  busy: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  buttonRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default ItemCard;
