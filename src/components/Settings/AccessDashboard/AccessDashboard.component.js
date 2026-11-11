import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import QrCodeIcon from '@material-ui/icons/CropFree';
import PlanIcon from '@material-ui/icons/CardMembership';
import InboxIcon from '@material-ui/icons/Inbox';
import PrintIcon from '@material-ui/icons/Print';
import DownloadIcon from '@material-ui/icons/GetApp';
import LinkIcon from '@material-ui/icons/Link';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import FullScreenDialog from '../../UI/FullScreenDialog';
import {
  DashboardNav,
  SectionHeader,
  ItemDetailsSurface
} from '../../UI/Dashboard';
import QrCodesView from './QrCodesView';
import PlanView from './PlanView';
import ExpiredAlerts from './ExpiredAlerts';
import ClientStatusChip from './ClientStatusChip';
import { getGateItems, getAccessUrl } from './accessGates';
import { printQrCode, downloadQrCode } from './qrCodeActions';
import messages from './AccessDashboard.messages';

const SECTIONS = {
  QR_CODES: 'qrCodes',
  PLAN: 'plan'
};

const useStyles = makeStyles((theme) => ({
  dashboard: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    flexShrink: 0,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
    alignItems: 'center',
    gap: theme.spacing(1, 2),

    padding: theme.spacing(2, 2),
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`,

    [theme.breakpoints.only('md')]: {
      gridTemplateColumns: 'none',
      gridAutoFlow: 'column',
      justifyContent: 'space-between'
    },

    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'minmax(0, 1fr) auto'
    }
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    padding: theme.spacing(2, 2)
  },
  scrollAreaWithPanel: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'stretch'
  },
  boards: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: theme.spacing(2, 2, 0)
  },
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8, 2),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  },
  emptyIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: '50%',
    marginBottom: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main
  },
  emptyIcon: {
    fontSize: '2.25rem'
  },
  emptyText: {
    maxWidth: 320
  },
  detailsLink: {
    wordBreak: 'break-all'
  },
  separator: {
    margin: theme.spacing(0, 0.75),
    opacity: 0.5
  },
  statusChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5)
  }
}));

const AccessDashboard = ({
  intl,
  clients,
  loading,
  error,
  onRetry,
  onClose,
  onOpenBoard,
  onCopyLink
}) => {
  const classes = useStyles();
  const [section, setSection] = useState(SECTIONS.QR_CODES);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  const items = getGateItems(clients);
  const selected = items.find((item) => item.key === selectedKey);

  const sections = [
    {
      key: SECTIONS.QR_CODES,
      label: intl.formatMessage(messages.qrCodes),
      hint: intl.formatMessage(messages.qrCodesHint),
      icon: QrCodeIcon
    },
    {
      key: SECTIONS.PLAN,
      label: intl.formatMessage(messages.plan),
      hint: intl.formatMessage(messages.planHint),
      icon: PlanIcon
    }
  ];

  const header =
    section === SECTIONS.QR_CODES
      ? {
          title: intl.formatMessage(messages.qrCodes),
          hint: intl.formatMessage(messages.qrCodesDescription)
        }
      : {
          title: intl.formatMessage(messages.plan),
          hint: intl.formatMessage(messages.planDescription)
        };

  const getDetails = ({ client, gate }) => {
    const accessUrl = getAccessUrl(client, gate);
    const qrNotGenerated = !gate.qrCodeUrl;
    const qrNotGeneratedHint = qrNotGenerated
      ? intl.formatMessage(messages.qrNotGenerated)
      : undefined;

    return {
      title: client.clientName,
      meta: [
        gate.code,
        gate.rootBoard &&
          intl.formatMessage(messages.opensBoard, {
            board: gate.rootBoard.name
          })
      ],
      thumb: { src: gate.qrCodeUrl, alt: gate.code, icon: QrCodeIcon },
      chips: (
        <>
          <Typography variant="caption" component="p" color="textSecondary">
            {intl.formatMessage(messages.scans, { count: gate.viewsCount })}
            {gate.lastAccessAt && (
              <>
                <span className={classes.separator} aria-hidden="true">
                  ·
                </span>
                {intl.formatMessage(messages.lastScan, {
                  time: intl.formatRelative(gate.lastAccessAt)
                })}
              </>
            )}
          </Typography>
          <Typography
            variant="caption"
            component="p"
            color="textSecondary"
            className={classes.detailsLink}
          >
            {accessUrl}
          </Typography>
          <div className={classes.statusChips}>
            <ClientStatusChip intl={intl} client={client} />
          </div>
        </>
      ),
      actions: [
        {
          key: 'print',
          label: intl.formatMessage(messages.print),
          icon: <PrintIcon />,
          disabled: qrNotGenerated,
          hint: qrNotGeneratedHint,
          onClick: () => printQrCode(gate.qrCodeUrl, client.clientName)
        },
        {
          key: 'download',
          label: intl.formatMessage(messages.download),
          icon: <DownloadIcon />,
          disabled: qrNotGenerated,
          hint: qrNotGeneratedHint,
          onClick: () =>
            downloadQrCode(gate.qrCodeUrl, `${client.slug}-${gate.code}.png`)
        },
        {
          key: 'copyLink',
          label: intl.formatMessage(messages.copyLink),
          icon: <LinkIcon />,
          onClick: () => onCopyLink(accessUrl)
        },
        {
          key: 'openBoard',
          label: intl.formatMessage(messages.openBoard),
          icon: <OpenInNewIcon />,
          onClick: () => onOpenBoard(client, gate)
        }
      ]
    };
  };

  const renderState = () => {
    if (loading) {
      return (
        <div className={classes.stateContainer}>
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return (
        <div className={classes.stateContainer}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={onRetry}>
                {intl.formatMessage(messages.tryAgain)}
              </Button>
            }
          >
            <AlertTitle>{intl.formatMessage(messages.errorLoading)}</AlertTitle>
          </Alert>
        </div>
      );
    }

    return (
      <div className={classes.stateContainer}>
        <div className={classes.emptyIconWrap}>
          <InboxIcon className={classes.emptyIcon} />
        </div>
        <Typography variant="subtitle1" className={classes.emptyText}>
          {intl.formatMessage(messages.noLocations)}
        </Typography>
      </div>
    );
  };

  const renderSection = () => {
    if (loading || error || !clients.length) {
      return <div className={classes.scrollArea}>{renderState()}</div>;
    }

    if (section === SECTIONS.PLAN) {
      return (
        <div className={classes.scrollArea}>
          <ExpiredAlerts intl={intl} clients={clients} />
          <PlanView intl={intl} clients={clients} />
        </div>
      );
    }

    const details = selected ? getDetails(selected) : {};

    return (
      <div className={classes.scrollAreaWithPanel}>
        <div className={classes.boards}>
          <ExpiredAlerts intl={intl} clients={clients} />
          <QrCodesView
            intl={intl}
            items={items}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />
        </div>
        <ItemDetailsSurface
          intl={intl}
          selectedKey={selected ? selectedKey : null}
          label={intl.formatMessage(messages.qrDetails)}
          emptyMessage={intl.formatMessage(messages.selectQrCode)}
          {...details}
          onClose={() => setSelectedKey(null)}
        />
      </div>
    );
  };

  return (
    <FullScreenDialog
      fullWidth
      fullHeight
      disableAppBarElevation
      open
      title={intl.formatMessage(messages.title)}
      onClose={onClose}
    >
      <div className={classes.dashboard}>
        <DashboardNav
          intl={intl}
          sections={sections}
          section={section}
          onChange={setSection}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          idPrefix="AccessDashboard"
          collapsedStorageKey="accessDashboardNavCollapsed"
        />

        <main className={classes.content}>
          <div className={classes.header}>
            <SectionHeader
              intl={intl}
              title={header.title}
              hint={header.hint}
              onOpenNav={() => setMobileNavOpen(true)}
            />
          </div>

          {renderSection()}
        </main>
      </div>
    </FullScreenDialog>
  );
};

AccessDashboard.defaultProps = {
  clients: [],
  loading: false,
  error: null
};

AccessDashboard.propTypes = {
  intl: intlShape.isRequired,
  clients: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
  onRetry: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenBoard: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired
};

export default AccessDashboard;
