import ISO6391 from 'iso-639-1';

export const getLangsOptions = state => {
  const allLangs = state.language.langs;
  const options = allLangs.map(lang => ({
    label: ISO6391.getNativeName(lang.split('-')[0]),
    value: lang
  }));

  return options;
};
