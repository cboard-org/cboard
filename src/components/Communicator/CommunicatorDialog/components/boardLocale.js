import Language from '../../../Settings/Language/Language.messages';

/**
 * Resolves the localized language name for a board's locale.
 * Returns a react-intl message descriptor or null when unknown.
 */
export const getBoardLocaleMessage = lang => {
  const source = lang || navigator.language || '';
  const locale = source.slice(0, 2).toLowerCase();
  return Language[locale] || null;
};

export const formatBoardLocale = (intl, lang) => {
  const message = getBoardLocaleMessage(lang);
  return message ? intl.formatMessage(message) : '';
};
