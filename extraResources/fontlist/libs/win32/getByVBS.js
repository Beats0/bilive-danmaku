/**
 * getByVBS
 * @author: oldj
 * @homepage: https://oldj.net
 */

const os = require('os')
const fs = require('fs')
const path = require('path')
const execFile = require('child_process').execFile
const util = require('util')

const p_copyFile = util.promisify(fs.copyFile)

function tryToGetFonts(s) {
  let a = s.split('\n')
  if (a[0].includes('Microsoft')) {
    a.splice(0, 3)
  }

  a = a.map(i => {
    i = i
      .split('\t')[0]
      .split(path.sep)
    i = i[i.length - 1]

    if (!i.match(/^[\w\s]+$/)) {
      i = ''
    }

    i = i
      .replace(/^\s+|\s+$/g, '')
      .replace(/(Regular|常规)$/i, '')
      .replace(/^\s+|\s+$/g, '')

    return i
  })

  return a.filter(i => i)
}

async function writeToTmpDir(fn) {
  let tmp_fn = path.join(os.tmpdir(), 'node-font-list-fonts.vbs')
  await p_copyFile(fn, tmp_fn)
  return tmp_fn
}

module.exports = async () => {
  let fn = path.join(__dirname, 'fonts.vbs')

  const is_in_asar = fn.includes('app.asar')
  if (is_in_asar) {
    fn = await writeToTmpDir(fn)
  }

  return new Promise((resolve, reject) => {
    let cmd = `cscript`

    execFile(cmd, [fn], { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      let fonts = []

      if (err) {
        reject(err)
        return
      }

      if (stdout) {
        //require('electron').dialog.showMessageBox({message: 'stdout: ' + stdout})
        fonts = fonts.concat(tryToGetFonts(stdout))
      }
      if (stderr) {
        //require('electron').dialog.showMessageBox({message: 'stderr: ' + stderr})
        fonts = fonts.concat(tryToGetFonts(stderr))
      }

      resolve(fonts)
    })
  })
}
