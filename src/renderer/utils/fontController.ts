const fontList = require('font-list')

const
fontList.getFonts({ disableQuoting: true })
  .then(fonts => {
    console.log(JSON.stringify(fonts))
  })
  .catch(err => {
    console.log(err)
  })
