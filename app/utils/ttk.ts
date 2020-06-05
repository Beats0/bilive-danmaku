import * as Configstore from 'configstore';

// BEGIN
function sM(a: string) {
  let b;
  if (yr !== null) b = yr;
  else {
    b = wr(String.fromCharCode(84));
    var c = wr(String.fromCharCode(75));
    b = [b(), b()];
    b[1] = c();
    b = (yr = window[b.join(c())] || '') || '';
  }
  var d = wr(String.fromCharCode(116));
  var c = wr(String.fromCharCode(107));
  var d = [d(), d()];
  d[1] = c();
  c = `&${d.join('')}=`;
  d = b.split('.');
  b = Number(d[0]) || 0;
  for (var e = [], f = 0, g = 0; g < a.length; g++) {
    let l = a.charCodeAt(g);
    l < 128
      ? (e[f++] = l)
      : (l < 2048
          ? (e[f++] = (l >> 6) | 192)
          : ((l & 64512) == 55296 &&
            g + 1 < a.length &&
            (a.charCodeAt(g + 1) & 64512) == 56320
              ? ((l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                (e[f++] = (l >> 18) | 240),
                (e[f++] = ((l >> 12) & 63) | 128))
              : (e[f++] = (l >> 12) | 224),
            (e[f++] = ((l >> 6) & 63) | 128)),
        (e[f++] = (l & 63) | 128));
  }
  a = b;
  for (f = 0; f < e.length; f++) (a += e[f]), (a = xr(a, '+-a^+6'));
  a = xr(a, '+-3^+b+-f');
  a ^= Number(d[1]) || 0;
  a < 0 && (a = (a & 2147483647) + 2147483648);
  a %= 1e6;
  return `${c}${a.toString()}.${a ^ b}`;
}

var yr = null;
var wr = function(a: string) {
  return function() {
    return a;
  };
};
var xr = function(a: string, b: string) {
  for (let c = 0; c < b.length - 2; c += 3) {
    var d = b.charAt(c + 2);
    var d = d >= 'a' ? d.charCodeAt(0) - 87 : Number(d);
    var d = b.charAt(c + 1) == '+' ? a >>> d : a << d;
    a = b.charAt(c) == '+' ? (a + d) & 4294967295 : a ^ d;
  }
  return a;
};

// END
const config = new Configstore('google-translate-api');

var window = {
  TKK: config.get('TKK') || '0'
};

export function updateTKK() {
  return new Promise(function(resolve, reject) {
    const now = Math.floor(Date.now() / 3600000);

    if (Number(window.TKK.split('.')[0]) === now) {
      resolve();
    } else {
      fetch('https://translate.google.cn')
        .then(async function(res) {
          const textString: string = await res.text();
          const code = textString.match(/TKK=(.*?)\(\)\)'\);/g);

          if (code) {
            eval(code[0]);
            /* eslint-disable no-undef */
            if (typeof TKK !== 'undefined') {
              window.TKK = TKK;
              config.set('TKK', TKK);
            }
          }

          /**
           * Note: If the regex or the eval fail, there is no need to worry. The server will accept
           * relatively old seeds.
           */

          resolve();
        })
        .catch(function(err) {
          const e = new Error();
          e.code = 'BAD_NETWORK';
          e.message = err.message;
          reject(e);
        });
    }
  });
}

export function get(text: string) {
  return updateTKK()
    .then(function() {
      let tk = sM(text);
      tk = tk.replace('&tk=', '');
      return { name: 'tk', value: tk };
    })
    .catch(function(err) {
      throw err;
    });
}
