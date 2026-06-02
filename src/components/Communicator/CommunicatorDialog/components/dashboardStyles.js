import { alpha } from '@material-ui/core/styles';

/**
 * Shared presentational tokens for the dashboard surfaces (cards / rows).
 * Everything is derived from the active theme so light/dark and custom
 * primary colors keep working; values fall back gracefully if a theme token
 * is missing.
 */

// Softer, more modern corner than the default 4px.
export const softRadius = theme => (theme.shape.borderRadius || 4) * 2;

const surfaceTransition = theme =>
  theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
    duration: theme.transitions.duration.shorter
  });

/**
 * Hover / focus treatment shared by BoardCard and BoardRow so both surfaces
 * react identically. `lift` adds a subtle upward translate (cards only).
 */
export const surfaceInteractive = (theme, { lift = false } = {}) => ({
  transition: surfaceTransition(theme),
  '&:hover': {
    borderColor: alpha(theme.palette.primary.main, 0.5),
    boxShadow: theme.shadows[3],
    ...(lift ? { transform: 'translateY(-2px)' } : {})
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.4)}`
  }
});

/**
 * Accent border used when a board is the communicator root or the active
 * board, so its status reads at a glance without extra chrome.
 */
export const surfaceAccent = theme => ({
  borderColor: alpha(theme.palette.primary.main, 0.6),
  boxShadow: `inset 3px 0 0 0 ${theme.palette.primary.main}`
});

/**
 * Theme-aware busy overlay. The previous hard-coded white wash was invisible
 * (and wrong) in dark mode.
 */
export const busyOverlay = theme => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.background.paper, 0.72),
  backdropFilter: 'blur(2px)',
  zIndex: 2
});
