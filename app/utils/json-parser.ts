/**
 * 解析字符串内包含的对象
 * @param {String} str 传入字符串
 * @returns {Array[Object]}
 */
function parser(str: string): any[] {
  let i = -1;
  const len = str.length;
  const result = [];

  const store = [];
  while (i++ < len - 1) {
    if (str[i] === '{') {
      store.push({
        index: i
      });
    }
    if (str[i] === '}') {
      const prev = store.pop();
      if (!prev) {
        console.warn(`${str}不是正确的对象字符串`);
        continue;
      }
      if (store.length === 0) {
        result.push(str.slice(prev.index, i + 1));
      }
    }
  }

  return result;
}

export { parser };
