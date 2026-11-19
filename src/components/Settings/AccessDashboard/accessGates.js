import { isCordova } from '../../../cordova-util';
import { ACCESS_APP_URL } from '../../../constants';

// The public endpoint rejects gates whose subscription has not started yet.
export const isClientNotStarted = (client, now = new Date()) =>
  !!client.subscriptionStart && new Date(client.subscriptionStart) > now;

// A paused client's gates return an error to visitors.
export const isClientPaused = (client, now = new Date()) =>
  !client.isActive || client.isExpired || isClientNotStarted(client, now);

export const getGateItems = (clients) =>
  clients.reduce(
    (items, client) =>
      items.concat(
        (client.accessGates || []).map((gate) => ({
          key: `${client.slug}/${gate.code}`,
          client,
          gate
        }))
      ),
    []
  );

export const getAccessPath = (client, gate) =>
  `/access/${client.slug}/${gate.code}`;

export const getAccessUrl = (client, gate) => {
  const origin = isCordova() ? ACCESS_APP_URL : window.location.origin;
  return `${origin}${getAccessPath(client, gate)}`;
};
