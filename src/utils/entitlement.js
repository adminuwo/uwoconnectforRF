/**
 * Centralized Entitlement & Access Control Evaluation Engine for Frontend
 */

export const ACCESS_STATES = {
  COMING_SOON: 'COMING_SOON',
  AVAILABLE: 'AVAILABLE',
  UPGRADE_REQUIRED: 'UPGRADE_REQUIRED',
  CONNECTED: 'CONNECTED',
  LIMIT_REACHED: 'LIMIT_REACHED'
};

/**
 * Evaluates access state for a channel, connector, or feature given client's entitlement object.
 */
export function evaluateAccessState(itemKey, itemType, entitlements) {
  if (!itemKey || !entitlements) return ACCESS_STATES.AVAILABLE;

  const keyNorm = String(itemKey).toLowerCase();

  if (itemType === 'channel') {
    const chObj = entitlements.channels?.[keyNorm] || entitlements.channels?.[itemKey];
    if (chObj) return chObj.status;
  }

  if (itemType === 'connector') {
    const connObj = entitlements.connectors?.[keyNorm] || entitlements.connectors?.[itemKey];
    if (connObj) return connObj.status;
  }

  if (itemType === 'feature') {
    const featObj = entitlements.features?.[keyNorm] || entitlements.features?.[itemKey];
    if (featObj) return featObj.status;
  }

  return ACCESS_STATES.AVAILABLE;
}

export function isChannelSelected(channelKey, entitlements) {
  if (!channelKey || !entitlements?.selected_channels) return false;
  const keyNorm = String(channelKey).toLowerCase();
  return entitlements.selected_channels.map(s => String(s).toLowerCase()).includes(keyNorm);
}

export function canSelectChannel(channelKey, entitlements) {
  if (!entitlements) return true;
  const isSelected = isChannelSelected(channelKey, entitlements);
  if (isSelected) return true;

  const selectedCount = entitlements.selected_channels?.length || 0;
  const limit = entitlements.channel_limit || 1;
  return selectedCount < limit;
}
