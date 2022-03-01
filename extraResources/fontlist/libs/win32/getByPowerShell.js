/**
 * getByPowerShell
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require('child_process').exec

const parse = (str) => {
  return str
    .split('\n')
    .map(ln => ln.trim())
    .filter(f => !!f)
}

/*
@see https://superuser.com/questions/760627/how-to-list-installed-font-families

  chcp 65001 | Out-Null
  Add-Type -AssemblyName PresentationCore
  $families = [Windows.Media.Fonts]::SystemFontFamilies
  foreach ($family in $families) {
    $name = ''
    if (!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'), [ref]$name)) {
      $name = $family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]
    }
    echo $name
  }
*/
module.exports = () => new Promise((resolve, reject) => {
  let cmd = `chcp 65001|powershell -command "chcp 65001|Out-Null;Add-Type -AssemblyName PresentationCore;$families=[Windows.Media.Fonts]::SystemFontFamilies;foreach($family in $families){$name='';if(!$family.FamilyNames.TryGetValue([Windows.Markup.XmlLanguage]::GetLanguage('zh-cn'),[ref]$name)){$name=$family.FamilyNames[[Windows.Markup.XmlLanguage]::GetLanguage('en-us')]}echo $name}"`

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout) => {
    if (err) {
      reject(err)
      return
    }

    resolve(parse(stdout))
  })
})
