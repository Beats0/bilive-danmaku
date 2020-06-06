import * as qs from 'qs';
import safeEval from './safeEval';
import * as ttk from './ttk';
import config from '../config';
import lang from '../i18n/locales/lang.json'

// see https://github.com/matheuss/google-translate-api
interface Options {
  from?: string;
  to?: string;
  raw?: boolean;
}

interface Result {
  text: string;
  from: {
    language: {
      didYouMean: boolean;
      iso: string;
    };
    text: {
      autoCorrected: boolean;
      value: string;
      didYouMean: boolean;
    };
  };
  raw?: string;
}

// 国外
// translate.suffix = 'com';
// 国内
translate.suffix = 'cn';

export const languages = {
  auto: 'Automatic',
  af: 'Afrikaans',
  sq: 'Albanian',
  am: 'Amharic',
  ar: 'Arabic',
  hy: 'Armenian',
  az: 'Azerbaijani',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali',
  bs: 'Bosnian',
  bg: 'Bulgarian',
  ca: 'Catalan',
  ceb: 'Cebuano',
  ny: 'Chichewa',
  'zh-cn': 'Chinese Simplified',
  'zh-tw': 'Chinese Traditional',
  co: 'Corsican',
  hr: 'Croatian',
  cs: 'Czech',
  da: 'Danish',
  nl: 'Dutch',
  en: 'English',
  eo: 'Esperanto',
  et: 'Estonian',
  tl: 'Filipino',
  fi: 'Finnish',
  fr: 'French',
  fy: 'Frisian',
  gl: 'Galician',
  ka: 'Georgian',
  de: 'German',
  el: 'Greek',
  gu: 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  haw: 'Hawaiian',
  iw: 'Hebrew',
  hi: 'Hindi',
  hmn: 'Hmong',
  hu: 'Hungarian',
  is: 'Icelandic',
  ig: 'Igbo',
  id: 'Indonesian',
  ga: 'Irish',
  it: 'Italian',
  ja: 'Japanese',
  jw: 'Javanese',
  kn: 'Kannada',
  kk: 'Kazakh',
  km: 'Khmer',
  ko: 'Korean',
  ku: 'Kurdish (Kurmanji)',
  ky: 'Kyrgyz',
  lo: 'Lao',
  la: 'Latin',
  lv: 'Latvian',
  lt: 'Lithuanian',
  lb: 'Luxembourgish',
  mk: 'Macedonian',
  mg: 'Malagasy',
  ms: 'Malay',
  ml: 'Malayalam',
  mt: 'Maltese',
  mi: 'Maori',
  mr: 'Marathi',
  mn: 'Mongolian',
  my: 'Myanmar (Burmese)',
  ne: 'Nepali',
  no: 'Norwegian',
  ps: 'Pashto',
  fa: 'Persian',
  pl: 'Polish',
  pt: 'Portuguese',
  ma: 'Punjabi',
  ro: 'Romanian',
  ru: 'Russian',
  sm: 'Samoan',
  gd: 'Scots Gaelic',
  sr: 'Serbian',
  st: 'Sesotho',
  sn: 'Shona',
  sd: 'Sindhi',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  es: 'Spanish',
  su: 'Sundanese',
  sw: 'Swahili',
  sv: 'Swedish',
  tg: 'Tajik',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  cy: 'Welsh',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zu: 'Zulu'
};

function getCode(desiredLang: string): string | boolean {
  if (!desiredLang) {
    return false;
  }
  desiredLang = desiredLang.toLowerCase();

  if (languages[desiredLang]) {
    return desiredLang;
  }

  const keys = Object.keys(languages).filter(function(key) {
    if (typeof languages[key] !== 'string') {
      return false;
    }

    return languages[key].toLowerCase() === desiredLang;
  });

  return keys[0] || false;
}

function isSupported(desiredLang: string): boolean {
  return Boolean(getCode(desiredLang));
}

export function translate(text: string, opts?: Options): Promise<Result> {
  opts = opts || {};
  let e: Error;
  [opts.from, opts.to].forEach(function(lang) {
    if (lang && !isSupported(lang)) {
      e = new Error();
      e.code = 400;
      e.message = `The language '${lang}' is not supported`;
    }
  });
  if (e) {
    return new Promise(function(resolve, reject) {
      reject(e);
    });
  }

  opts.from = opts.from || 'auto';
  opts.to = opts.to || 'zh-cn';

  opts.from = getCode(opts.from);
  opts.to = getCode(opts.to);

  return ttk
    .get(text)
    .then(function(token) {
      let url = `https://translate.google.${translate.suffix}/translate_a/single`;
      const data = {
        client: 'gtx',
        sl: opts.from,
        tl: opts.to,
        hl: opts.to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'sos', 'ss', 't'],
        otf: 1,
        ssel: 0,
        tsel: 0,
        kc: 1,
        q: text
      };
      data[token.name] = token.value;
      url = `${url}?${qs.stringify(data, { indices: false })}`;
      return url;
    })
    .then(function(url) {
      return fetch(url, {
        method: 'GET'
      })
        .then(async function(res: Response) {
          const result: Result = {
            text: '',
            from: {
              language: {
                didYouMean: false,
                iso: ''
              },
              text: {
                autoCorrected: false,
                value: '',
                didYouMean: false
              }
            },
            raw: ''
          };
          const textString: string = await res.text();
          if (opts.raw) {
            result.raw = textString;
          }

          const body: any[] = safeEval(textString);
          body[0].forEach(function(obj) {
            if (obj[0]) {
              result.text += obj[0];
            }
          });

          if (body[2] === body[8][0][0]) {
            result.from.language.iso = body[2];
          } else {
            result.from.language.didYouMean = true;
            result.from.language.iso = body[8][0][0];
          }

          if (body[7] && body[7][0]) {
            let str = body[7][0];

            str = str.replace(/<b><i>/g, '[');
            str = str.replace(/<\/i><\/b>/g, ']');

            result.from.text.value = str;

            if (body[7][5] === true) {
              result.from.text.autoCorrected = true;
            } else {
              result.from.text.didYouMean = true;
            }
          }
          return result;
        })
        .catch(function(err: Error) {
          throw err;
        });
    });
}

export function getTranslateTTSUrl(text: string, iso = config.voiceTranslateTo) {
  return ttk.get(text).then(function(token) {
    const voiceData = {
      client: 'gtx',
      q: text,
      textlen: text.length,
      tl: iso,
      total: 1
    };
    voiceData[token.name] = token.value;
    const url = `https://translate.google.cn/translate_tts?${qs.stringify(
      voiceData
    )}`;
    return url;
  });
}

export function currentTranslateToCode(): string {
  const currentLang = lang.filter(i => i.code === config.translateTo)[0];

  if (currentLang.code === 'zhCn') return 'zh-cn';
  return currentLang.code;
}
