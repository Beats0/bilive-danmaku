import { shell } from 'electron';

function openLink(href: string) {
  shell.openExternal(href).catch(e => {
    console.log(e);
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
 * @param {string} serverVersion 服务器端版本.
 * @param {string} clientVersion 客户端版本
 * @return {boolean} 判断是否能更新
 */
const hasNewVersion = (
  serverVersion: string,
  clientVersion: string
): boolean => {
  const arr1 = serverVersion.split('.');
  const arr2 = clientVersion.split('.');
  // 将两个版本号拆成数字
  const minL = Math.min(arr1.length, arr2.length);
  let pos = 0; // 当前比较位
  let diff = 0; // 当前为位比较是否相等

  // 逐个比较如果当前位相等则继续比较下一位
  while (pos < minL) {
    diff = parseInt(arr1[pos], 10) - parseInt(arr2[pos], 10);
    if (diff !== 0) {
      break;
    }
    pos++;
  }

  if (diff > 0) {
    return true;
  }
  return false;
};

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
  hasNewVersion
};
