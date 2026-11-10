import { isCordova } from '../../../cordova-util';
import { ACCESS_APP_URL } from '../../../constants';

export const isClientPaused = (client) => !client.isActive || client.isExpired;

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
