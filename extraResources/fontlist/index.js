/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

const platform = process.platform

let getFontsFunc
switch (platform) {
  case 'darwin':
    getFontsFunc = require('./libs/darwin')
    break
  case 'win32':
    getFontsFunc = require('./libs/win32')
    break
  case 'linux':
    getFontsFunc = require('./libs/linux')
    break
  default:
    throw new Error(`Error: font-list can not run on ${platform}.`)
}

const defaultOptions = {
  disableQuoting: false
}

exports.getFonts = async (options) => {
  options = Object.assign({}, defaultOptions, options)

  let fonts = await getFontsFunc()

  fonts = fonts.map(i => {
    // parse unicode names, eg: '"\\U559c\\U9e4a\\U805a\\U73cd\\U4f53"' -> '"喜鹊聚珍体"'
    try {
      i = i.replace(/\\u([\da-f]{4})/ig, (m, s) => String.fromCharCode(parseInt(s, 16)))
    } catch (e) {
      console.log(e)
    }

    if (options && options.disableQuoting) {
      if (i.startsWith('"') && i.endsWith('"')) {
        i = `${i.substr(1, i.length - 2)}`
      }
    } else if (i.includes(' ') && !i.startsWith('"')) {
      i = `"${i}"`
    }

    return i
  })

  fonts.sort((a, b) => {
    return a.replace(/^['"]+/, '').toLocaleLowerCase() < b.replace(/^['"]+/, '').toLocaleLowerCase() ? -1 : 1
  })

  return fonts
}
