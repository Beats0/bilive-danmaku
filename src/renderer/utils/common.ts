import { ipcRenderer, shell } from "electron";
import { lt } from "semver";

function openLink(href: string) {
  shell.openExternal(href).catch(e => {
    console.warn(e);
  });
}

function userAvatarFilter(avatar: string): string {
  const gifRe = /\.(gif)$/;
  const webpRe = /\.(webp)$/;
  const jpgRe = /\.(jpg)$/;
  if (gifRe.test(avatar) || webpRe.test(avatar)) return avatar;
  if (jpgRe.test(avatar)) return `${avatar}_64x64.jpg`;
  return avatar;
}

function toPercentNum(number: number): number {
  const numberP = Math.floor(number * 100);
  return numberP;
}

function isInclude(item: string | number, lists: string[] | number[]): boolean {
  return lists.includes(item);
}

function arrayDiff(arr1: any[], arr2: any[]): any[] {
  return arr1.filter(el => !arr2.includes(el));
}

function setCssVariable(configKey: string, value: string | null) {
  const propertyName = `--primary-${configKey}`;
  document.documentElement.style.setProperty(propertyName, value);
}

// 太菜了，写法好low (
const sortBy = (sortKey: string, reverse = false, sortKeyPrefix?: string) => (
  a,
  b
) => {
  if (sortKeyPrefix) {
    if (a[sortKeyPrefix][`${sortKey}`] < b[sortKeyPrefix][`${sortKey}`]) {
      return reverse ? -1 : 1;
    }
    if (a[sortKeyPrefix][`${sortKey}`] > b[sortKeyPrefix][`${sortKey}`]) {
      return reverse ? 1 : -1;
    }
    return 0;
  }
  if (a[`${sortKey}`] < b[`${sortKey}`]) {
    return reverse ? -1 : 1;
  }
  if (a[`${sortKey}`] > b[`${sortKey}`]) {
    return reverse ? 1 : -1;
  }
  return 0;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function unionSet(array: any[], key: string) {
  const hash = {};
  let result = [];
  result = array.reduce((item, next) => {
    hash[next[key]] ? '' : (hash[next[key]] = true && item.push(next));
    return item;
  }, []);
  return result;
}

function tranNumber(num: number, point = 2): string {
  const numStr = num.toString();
  if (numStr.length < 5) {
    return numStr;
  }
  const decimal = numStr.substring(
    numStr.length - 4,
    numStr.length - 4 + point
  );
  return `${parseFloat(`${parseInt(String(num / 10000), 10)}.${decimal}`)}w`;
}

/**
 * @param {string} clientVersion 客户端版本
 * @param {string} serverVersion 服务器端版本.
 * @return {boolean} 判断是否能更新
 */
const hasNewVersion = (
  clientVersion: string,
  serverVersion: string
): boolean => {
  return lt(clientVersion, serverVersion);
};

/**
 * 时间格式化
 * @param   {Date}        date
 * @param   {string}      fmt   YYYY-mm-dd HH:MM => 2022-02-15 19:45
 * @return  {string}
 * */
function dateFormat(date: Date, fmt: string) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),
    "m+": (date.getMonth() + 1).toString(),
    "d+": date.getDate().toString(),
    "H+": date.getHours().toString(),
    "M+": date.getMinutes().toString(),
    "S+": date.getSeconds().toString()
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

export const systemFonts: string[] = [];

// 获取系统字体列表
ipcRenderer.send('getSystemFonts');
ipcRenderer.on('getSystemFontsCb', (e, fonts: string[] = []) => {
  // console.log('fonts', fonts);
  systemFonts = fonts;
});

export {
  openLink,
  userAvatarFilter,
  toPercentNum,
  isInclude,
  arrayDiff,
  setCssVariable,
  sortBy,
  sleep,
  unionSet,
  tranNumber,
  hasNewVersion,
  dateFormat,
};
