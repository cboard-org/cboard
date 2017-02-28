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
import hiLocaleData from 'react-intl/locale-data/hi';
import idLocaleData from 'react-intl/locale-data/id';
import nlLocaleData from 'react-intl/locale-data/nl';
import csLocaleData from 'react-intl/locale-data/cs';
import daLocaleData from 'react-intl/locale-data/da';
import roLocaleData from 'react-intl/locale-data/ro';
import skLocaleData from 'react-intl/locale-data/sk';
import svLocaleData from 'react-intl/locale-data/sv';
import thLocaleData from 'react-intl/locale-data/th';

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
  ...ruLocaleData,
  ...hiLocaleData,
  ...idLocaleData,
  ...nlLocaleData,
  ...csLocaleData,
  ...daLocaleData,
  ...roLocaleData,
  ...skLocaleData,
  ...svLocaleData,
  ...thLocaleData,
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
const hi = require('./translations/hi.json');
const id = require('./translations/id.json');
const nl = require('./translations/nl.json');
const cs = require('./translations/cs.json');
const da = require('./translations/da.json');
const ro = require('./translations/ro.json');
const sk = require('./translations/sk.json');
const sv = require('./translations/sv.json');
const th = require('./translations/th.json');

export const translationMessages = { ar, de, en, es, fr, he, it, ja, ko, pl, pt, ru, hi, id, nl, cs, da, ro, sk, sv, th };
export const appLocales = Object.keys(translationMessages);
export const navigatorLanguage = normalizeLanguageCode(navigator.language);

export function stripRegionCode(language) {
  if (!language) { return; }
  return language.toLowerCase().split(/[_-]+/)[0];
}

export function normalizeLanguageCode(language) {
  let normalizedCode = language.split(/[_-]+/);
  normalizedCode[0] = normalizedCode[0].toLowerCase();
  normalizedCode[1] = normalizedCode[1].toUpperCase();
  normalizedCode = normalizedCode.join('-');
  return normalizedCode;
}