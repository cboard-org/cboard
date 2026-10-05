import React from 'react';
import PropTypes from 'prop-types';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

// Softer corner than the default 4px, matching the app's card surfaces.
const chipRadius = (theme) => (theme.shape.borderRadius || 4) * 2;

/**
 * A tinted ground with a same-hue label. The label takes the dark or light
 * shade of the hue (whichever the theme needs) so it keeps contrast on the
 * tint; a plain color string is accepted for neutral tones.
 */
const tone = (theme, color) => {
  const isDark = theme.palette.type === 'dark';
  const main = color.main || color;
  const label = (isDark ? color.light : color.dark) || main;

  return {
    color: label,
    backgroundColor: alpha(main, isDark ? 0.22 : 0.11),
    borderColor: alpha(main, isDark ? 0.42 : 0.26)
  };
};

const useStyles = makeStyles((theme) => ({
  // MUI injects its own .MuiChip-outlined rules after component styles, so a
  // single-class override loses the cascade and the chip falls back to the
  // default grey outline. Doubling the selector settles it by specificity.
  chip: {
    '&&': {
      height: 24,
      borderRadius: chipRadius(theme),
      borderStyle: 'solid',
      borderWidth: 1,
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.02em'
    },
    '& .MuiChip-label': {
      paddingLeft: theme.spacing(0.75),
      paddingRight: theme.spacing(1)
    },
    '& .MuiChip-icon': {
      color: 'inherit',
      fontSize: '0.9375rem',
      marginLeft: theme.spacing(0.75),
      marginRight: 0
    }
  },
  withoutIcon: {
    '& .MuiChip-label': {
      paddingLeft: theme.spacing(1)
    }
  },
  primary: { '&&': tone(theme, theme.palette.primary) },
  secondary: { '&&': tone(theme, theme.palette.secondary) },
  success: { '&&': tone(theme, theme.palette.success || { main: '#369b00' }) },
  neutral: { '&&': tone(theme, theme.palette.text.secondary) }
}));

/**
 * The app's badge: a tinted ground with a same-hue label, sized to sit inside a
 * row of text. Chips go through here so a count and a status never read as two
 * different components.
 */
const TonalChip = ({ tone, icon, label, title, className }) => {
  const classes = useStyles();

  return (
    <Chip
      size="small"
      variant="outlined"
      icon={icon}
      label={label}
      title={title}
      aria-label={title}
      className={[
        classes.chip,
        classes[tone],
        icon ? '' : classes.withoutIcon,
        className || ''
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
};

TonalChip.defaultProps = {
  tone: 'primary'
};

TonalChip.propTypes = {
  tone: PropTypes.oneOf(['primary', 'secondary', 'success', 'neutral']),
  icon: PropTypes.element,
  label: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string
};

export default TonalChip;
