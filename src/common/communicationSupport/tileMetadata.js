import { LEGACY_COMMUNICATION_TILE_METADATA_KEYS } from './legacy';

export const COMMUNICATION_TILE_METADATA_KEYS = {
  synonyms: 'communicationSynonyms',
  excludeTokens: 'communicationExcludeTokens',
  category: 'communicationCategory'
};

export { LEGACY_COMMUNICATION_TILE_METADATA_KEYS } from './legacy';

function readFirstString(target, keys) {
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const value = target && target[key];
    if (typeof value === 'string' && value.length) {
      return value;
    }
  }

  return '';
}

export function getCommunicationTileMetadata(target = {}) {
  return {
    synonyms: readFirstString(target, [
      COMMUNICATION_TILE_METADATA_KEYS.synonyms,
      LEGACY_COMMUNICATION_TILE_METADATA_KEYS.synonyms
    ]),
    excludeTokens: readFirstString(target, [
      COMMUNICATION_TILE_METADATA_KEYS.excludeTokens,
      LEGACY_COMMUNICATION_TILE_METADATA_KEYS.excludeTokens
    ]),
    category: readFirstString(target, [
      COMMUNICATION_TILE_METADATA_KEYS.category,
      LEGACY_COMMUNICATION_TILE_METADATA_KEYS.category
    ])
  };
}

export function setCommunicationTileMetadata(target = {}, metadata = {}) {
  const nextTarget = { ...target };

  if (Object.prototype.hasOwnProperty.call(metadata, 'synonyms')) {
    nextTarget[COMMUNICATION_TILE_METADATA_KEYS.synonyms] =
      metadata.synonyms || '';
    nextTarget[LEGACY_COMMUNICATION_TILE_METADATA_KEYS.synonyms] =
      metadata.synonyms || '';
  }

  if (Object.prototype.hasOwnProperty.call(metadata, 'excludeTokens')) {
    nextTarget[COMMUNICATION_TILE_METADATA_KEYS.excludeTokens] =
      metadata.excludeTokens || '';
    nextTarget[LEGACY_COMMUNICATION_TILE_METADATA_KEYS.excludeTokens] =
      metadata.excludeTokens || '';
  }

  if (Object.prototype.hasOwnProperty.call(metadata, 'category')) {
    nextTarget[COMMUNICATION_TILE_METADATA_KEYS.category] =
      metadata.category || '';
    nextTarget[LEGACY_COMMUNICATION_TILE_METADATA_KEYS.category] =
      metadata.category || '';
  }

  return nextTarget;
}
