/**
 * 字符串转化为Byte字节
 * @param {String} str 要转化的字符串
 * @return {Array[byte]} 字节数组
 */
function str2bytes(str: string): number[] {
  const bytes = [];
  let c;
  const len = str.length;
  for (let i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return bytes;
}

/**
 * 将字节数组转化为字符串
 * @param {Array[byte]} bytesArray 字节数组
 * @return {String} 字符串
 */
function bytes2str(array: number[]): string {
  const bytes = array.slice(0);
  const filterArray = [
    [0x7f],
    [0x1f, 0x3f],
    [0x0f, 0x3f, 0x3f],
    [0x07, 0x3f, 0x3f, 0x3f]
  ];
  let j;
  let str = '';
  for (let i = 0; i < bytes.length; i += j) {
    const item = bytes[i];
    let number = '';
    if (item >= 240) {
      j = 4;
    } else if (item >= 224) {
      j = 3;
    } else if (item >= 192) {
      j = 2;
    } else if (item < 128) {
      j = 1;
    }
    const filter = filterArray[j - 1];
    for (let k = 0; k < j; k++) {
      let r = (bytes[i + k] & filter[k]).toString(2);
      const l = r.length;
      if (l > 6) {
        number = r;
        break;
      }
      for (let n = 0; n < 6 - l; n++) {
        r = `0${r}`;
      }
      number += r;
    }
    str += String.fromCharCode(parseInt(number, 2));
  }
  return str;
}

export { str2bytes, bytes2str };
