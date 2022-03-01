/**
 * index
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

const os = require('os')
const getByPowerShell = require('./getByPowerShell')
const getByVBS = require('./getByVBS')

const methods_new = [getByPowerShell, getByVBS]
const methods_old = [getByVBS, getByPowerShell]

module.exports = async () => {
  let fonts = []

  // @see {@link https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js}
  let os_v = parseInt(os.release())
  let methods = os_v >= 10 ? methods_new : methods_old

  for (let method of methods) {
    try {
      fonts = await method()
      if (fonts.length > 0) break
    } catch (e) {
      console.log(e)
    }
  }

  return fonts
}
