import { createRequire } from 'module';
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);

export const cachedEvents = require('./cachedEvents.json');
export const emoji = require('./emoji.json');
export const factions = require('./factions.json');
export const localeMap = require('./localeMap.json');
export const locales = require('./locales.json');

export const i18n = {};
locales.forEach((locale) => {
  // eslint-disable-next-line import/no-dynamic-require
  i18n[locale] = require(`./locales/${locale}.json`);
});

export const missionTypes = require('./missionTypes.json');
export const pingables = require('./pingables.json');
export const platformMap = require('./platformMap.json');
export const rssFeeds = require('./rssFeeds.json');
export const syndicates = require('./syndicates.json');
export const trackables = require('./trackables.json');
export const twitch = require('./twitch.json');
export const welcomes = require('./welcomes.json');

export const DiscordLocales = [
  'vi',
  'da',
  'he',
  'zh-TW',
  'ja',
  'th',
  'hi',
  'ru',
  'pl',
  'fr',
  'lt',
  'en-GB',
  'pt-BR',
  'it',
  'cs',
  'bg',
  'hr',
  'tr',
  'hu',
  'ro',
  'ar',
  'de',
  'ko',
  'el',
  'en-US',
  'no',
  'sv-SE',
  'uk',
  'zh-CN',
  'nl',
  'es-ES',
  'fi',
];

export const LocalDiscordLocaleMappings = {
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-BR',
  zh: 'zh-CN',
};

export const cmds = {};
const allCommands = {};
const ldirname = dirname(fileURLToPath(import.meta.url));
const nameRegex = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;
await Promise.all(
  locales.map(async (locale) => {
    const p = path.resolve(ldirname, './locales/commands', `${locale}.js`);
    if (
      (fs.existsSync(p) && DiscordLocales.includes(locale)) ||
      DiscordLocales.includes(LocalDiscordLocaleMappings[locale])
    ) {
      let localeKey;
      if (DiscordLocales.includes(locale)) localeKey = locale;
      if (DiscordLocales.includes(LocalDiscordLocaleMappings[locale])) localeKey = LocalDiscordLocaleMappings[locale];
      allCommands[localeKey] = (await import(p)).default;
    }
  })
);

Object.entries(allCommands['en-US']).forEach(([key, { name, description }]) => {
  cmds[key] = {
    name,
    description,
    name_localizations: {
      'en-US': name,
    },
    description_localizations: {
      'en-US': description,
    },
  };

  locales.forEach((locale) => {
    if (locale === 'en') return;
    let localeKey;
    if (DiscordLocales.includes(locale)) localeKey = locale;
    if (DiscordLocales.includes(LocalDiscordLocaleMappings[locale])) localeKey = LocalDiscordLocaleMappings[locale];
    if (!localeKey) return;
    const l7d = allCommands?.[localeKey]?.[key];
    if (l7d && nameRegex.test(l7d.name)) {
      cmds[key].name_localizations[localeKey] = l7d.name;
      cmds[key].description_localizations[localeKey] = l7d.description;
    }
  });
});
