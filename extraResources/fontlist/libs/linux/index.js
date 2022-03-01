/**
 * index
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require('child_process').exec
const util = require('util')

const pexec = util.promisify(exec)

async function binaryExists(binary) {
  const { stdout } = await pexec(`whereis ${binary}`)
  return stdout.length > (binary.length + 2)
}

module.exports = async () => {
  const fcListBinary = await binaryExists('fc-list')
    ? 'fc-list'
    : 'fc-list2'

  const cmd = fcListBinary + ' -f "%{family[0]}\\n"'

  const { stdout } = await pexec(cmd, { maxBuffer: 1024 * 1024 * 10 })
  const fonts = stdout.split('\n').filter(f => !!f)

  return Array.from(new Set(fonts))
}
