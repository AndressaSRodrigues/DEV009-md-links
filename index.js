const { checkAbsolute, pathExists, getExtension, readFiles } = require('./data');

function mdLinks(fp) {
  return new Promise((resolve, reject) => {
    const absolutePath = checkAbsolute(fp); //replace(/\\/g, '\\\\');

    if (!pathExists(absolutePath)) {
      reject('Path does not exist');
      return;
    }

    readFiles(absolutePath).then((links) => {
      if (links.length > 0) {
        resolve(links);
        } else {
          reject('No links in the file.')
        }

        return;
        
      })
  });
}

module.exports = { mdLinks };