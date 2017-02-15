import { addLocaleData } from 'react-intl';
import arLocaleData from 'react-intl/locale-data/ar';
import deLocaleData from 'react-intl/locale-data/de';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';
import frLocaleData from 'react-intl/locale-data/fr';
import heLocaleData from 'react-intl/locale-data/he';
import itLocaleData from 'react-intl/locale-data/it';
import jaLocaleData from 'react-intl/locale-data/ja';
import koLocaleData from 'react-intl/locale-data/ko';
import plLocaleData from 'react-intl/locale-data/pl';
import ptLocaleData from 'react-intl/locale-data/pt';
import ruLocaleData from 'react-intl/locale-data/ru';

addLocaleData([
  ...arLocaleData,
  ...deLocaleData,
  ...enLocaleData,
  ...esLocaleData,
  ...frLocaleData,
  ...heLocaleData,
  ...itLocaleData,
  ...jaLocaleData,
  ...koLocaleData,
  ...plLocaleData,
  ...ptLocaleData,
  ...ruLocaleData
]);

const ar = require('./translations/ar.json');
const de = require('./translations/de.json');
const en = require('./translations/en.json');
const es = require('./translations/es.json');
const fr = require('./translations/fr.json');
const he = require('./translations/he.json');
const it = require('./translations/it.json');
const ja = require('./translations/ja.json');
const ko = require('./translations/ko.json');
const pl = require('./translations/pl.json');
const pt = require('./translations/pt.json');
const ru = require('./translations/ru.json');

export const translationMessages = { ar, de, en, es, fr, he, it, ja, ko, pl, pt, ru };
export const appLocales = Object.keys(translationMessages);
export const navigatorLanguage = navigator.language;

export function stripRegionCode(language) {
  if (!language) { return; }
  return language.toLowerCase().split(/[_-]+/)[0];
}