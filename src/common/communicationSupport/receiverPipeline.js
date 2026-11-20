import {
  createCommunicationOutputFromMatches,
  matchTextToCommunicationTiles
} from './symbolMatching';

export function createReceiverReviewId(prefix = 'review') {
  return (
    prefix +
    '_' +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );
}

export function buildReceiverReviewItems(
  matches,
  createId = createReceiverReviewId
) {
  return (matches || []).map(match => ({
    id: createId('review'),
    token: match.token,
    tile: match.tile,
    matchType: match.matchType
  }));
}

export function buildReceiverLoopState(text, boards, options = {}) {
  const result = matchTextToCommunicationTiles(text, boards, options);
  const reviewItems = buildReceiverReviewItems(
    result.matches,
    options.createId
  );

  return {
    inputText: result.inputText,
    segmentation: result.segmentation,
    matches: result.matches,
    reviewItems,
    missingTokens: reviewItems
      .filter(item => !item.tile)
      .map(item => item.token),
    outputPreview: createCommunicationOutputFromMatches(reviewItems),
    matchRate: result.matchRate
  };
}

export function moveReceiverReviewItem(reviewItems, itemId, offset) {
  const currentIndex = reviewItems.findIndex(item => item.id === itemId);
  const targetIndex = currentIndex + offset;

  if (
    currentIndex < 0 ||
    targetIndex < 0 ||
    targetIndex >= reviewItems.length
  ) {
    return reviewItems;
  }

  const nextItems = reviewItems.slice();
  const currentItem = nextItems[currentIndex];
  nextItems.splice(currentIndex, 1);
  nextItems.splice(targetIndex, 0, currentItem);
  return nextItems;
}

export function deleteReceiverReviewItem(reviewItems, itemId) {
  return reviewItems.filter(item => item.id !== itemId);
}

export function replaceReceiverReviewItem(reviewItems, itemId, candidate) {
  return reviewItems.map(item => {
    if (item.id !== itemId) {
      return item;
    }

    return {
      ...item,
      tile: candidate,
      matchType: 'manual'
    };
  });
}

export function buildReceiverOutputPreview(reviewItems) {
  return createCommunicationOutputFromMatches(reviewItems);
}

export function buildReceiverHistoryEntry(inputText, reviewItems) {
  const outputItems = buildReceiverOutputPreview(reviewItems);

  return {
    direction: 'receive',
    inputText,
    labels: outputItems.map(item => item.label).filter(Boolean)
  };
}
