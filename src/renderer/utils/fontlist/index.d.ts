/**
 * index.d.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

interface IOptions {
  disableQuoting: boolean;
}

type FontList = string[]

export function getFonts (options?: IOptions): Promise<FontList>;
