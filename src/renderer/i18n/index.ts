import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import jaTrans from './locales/ja.json';
import zhCnTrans from './locales/zh-cn.json';
import config from '../config';

const fallbackLng = 'zhCn';
const defaultNS = 'translation';
const lng = config.languageCode || fallbackLng;

const resources = {
  zhCn: {
    common: {
      ...zhCnTrans
    }
  },
  ja: {
    common: {
      ...jaTrans
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng,
    ns: [defaultNS, 'local'],
    defaultNS,
    fallbackNS: ['local', 'common'],
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    debug: false,
    // react: {
    //   wait: true
    // }
  });

export default i18n;
