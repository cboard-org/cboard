import { alpha } from '@material-ui/core/styles';

export const softRadius = (theme) => (theme.shape.borderRadius || 4) * 2;

const surfaceTransition = (theme) =>
  theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
    duration: theme.transitions.duration.shorter
  });

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

export const surfaceAccent = (theme) => ({
  borderColor: alpha(theme.palette.primary.main, 0.6),
  boxShadow: `inset 3px 0 0 0 ${theme.palette.primary.main}`
});

export const busyOverlay = (theme) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.background.paper, 0.72),
  backdropFilter: 'blur(2px)',
  zIndex: 2
});
