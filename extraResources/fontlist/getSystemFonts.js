const { getFonts } = require('./index');

function getSystemFonts() {
  return new Promise((resolve, reject) => {
    getFonts({ disableQuoting: true })
      .then((fonts) => {
        fonts = [...new Set(fonts)];
        resolve(fonts || []);
      })
      .catch((err) => {
        resolve([]);
      });
  });
}

(async () => {
  const fonts = await getSystemFonts();
  process.send(fonts);
  // console.log('fonts', fonts);
})();
