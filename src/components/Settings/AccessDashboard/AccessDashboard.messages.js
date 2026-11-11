import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'cboard.components.Settings.AccessDashboard.title',
    defaultMessage: 'Cboard Access'
  },
  qrCodes: {
    id: 'cboard.components.Settings.AccessDashboard.qrCodes',
    defaultMessage: 'QR codes'
  },
  qrCodesHint: {
    id: 'cboard.components.Settings.AccessDashboard.qrCodesHint',
    defaultMessage: 'Print, download, share'
  },
  qrCodesDescription: {
    id: 'cboard.components.Settings.AccessDashboard.qrCodesDescription',
    defaultMessage: 'Select a code to print, download or share it'
  },
  qrCodesCount: {
    id: 'cboard.components.Settings.AccessDashboard.qrCodesCount',
    defaultMessage: '{count, plural, one {# QR code} other {# QR codes}}'
  },
  plan: {
    id: 'cboard.components.Settings.AccessDashboard.plan',
    defaultMessage: 'Plan'
  },
  planHint: {
    id: 'cboard.components.Settings.AccessDashboard.planHint',
    defaultMessage: 'Subscription status'
  },
  planDescription: {
    id: 'cboard.components.Settings.AccessDashboard.planDescription',
    defaultMessage: 'Subscription status of each location'
  },
  scans: {
    id: 'cboard.components.Settings.AccessDashboard.scans',
    defaultMessage:
      '{count, plural, =0 {No scans yet} one {# scan} other {# scans}}'
  },
  lastScan: {
    id: 'cboard.components.Settings.AccessDashboard.lastScan',
    defaultMessage: 'Last scan {time}'
  },
  opensBoard: {
    id: 'cboard.components.Settings.AccessDashboard.opensBoard',
    defaultMessage: 'Opens {board}'
  },
  statusActive: {
    id: 'cboard.components.Settings.AccessDashboard.statusActive',
    defaultMessage: 'Active'
  },
  statusPaused: {
    id: 'cboard.components.Settings.AccessDashboard.statusPaused',
    defaultMessage: 'Paused'
  },
  statusExpired: {
    id: 'cboard.components.Settings.AccessDashboard.statusExpired',
    defaultMessage: 'Expired'
  },
  print: {
    id: 'cboard.components.Settings.AccessDashboard.print',
    defaultMessage: 'Print'
  },
  download: {
    id: 'cboard.components.Settings.AccessDashboard.download',
    defaultMessage: 'Download'
  },
  copyLink: {
    id: 'cboard.components.Settings.AccessDashboard.copyLink',
    defaultMessage: 'Copy link'
  },
  openBoard: {
    id: 'cboard.components.Settings.AccessDashboard.openBoard',
    defaultMessage: 'Open board'
  },
  linkCopied: {
    id: 'cboard.components.Settings.AccessDashboard.linkCopied',
    defaultMessage: 'Link copied'
  },
  copyLinkFailed: {
    id: 'cboard.components.Settings.AccessDashboard.copyLinkFailed',
    defaultMessage: 'Could not copy the link'
  },
  qrNotGenerated: {
    id: 'cboard.components.Settings.AccessDashboard.qrNotGenerated',
    defaultMessage: 'This QR code has not been generated yet'
  },
  qrDetails: {
    id: 'cboard.components.Settings.AccessDashboard.qrDetails',
    defaultMessage: 'QR code details'
  },
  selectQrCode: {
    id: 'cboard.components.Settings.AccessDashboard.selectQrCode',
    defaultMessage: 'Select a QR code to see its details'
  },
  expiredTitle: {
    id: 'cboard.components.Settings.AccessDashboard.expiredTitle',
    defaultMessage: '{name}: subscription expired'
  },
  expiredDescription: {
    id: 'cboard.components.Settings.AccessDashboard.expiredDescription',
    defaultMessage:
      'It expired on {date}, so its QR code is paused. Contact Cboard support to renew.'
  },
  contactSupport: {
    id: 'cboard.components.Settings.AccessDashboard.contactSupport',
    defaultMessage: 'Contact support'
  },
  validUntil: {
    id: 'cboard.components.Settings.AccessDashboard.validUntil',
    defaultMessage: 'Valid until {date}'
  },
  expiredOn: {
    id: 'cboard.components.Settings.AccessDashboard.expiredOn',
    defaultMessage: 'Expired on {date}'
  },
  qrPaused: {
    id: 'cboard.components.Settings.AccessDashboard.qrPaused',
    defaultMessage: 'QR paused'
  },
  planFootnote: {
    id: 'cboard.components.Settings.AccessDashboard.planFootnote',
    defaultMessage:
      'Plans are managed by the Cboard team. To renew, change your plan or add a location, contact support.'
  },
  noLocations: {
    id: 'cboard.components.Settings.AccessDashboard.noLocations',
    defaultMessage: 'You have no Cboard Access locations yet.'
  },
  errorLoading: {
    id: 'cboard.components.Settings.AccessDashboard.errorLoading',
    defaultMessage: 'Could not load your Cboard Access locations'
  },
  tryAgain: {
    id: 'cboard.components.Settings.AccessDashboard.tryAgain',
    defaultMessage: 'Try again'
  }
});
