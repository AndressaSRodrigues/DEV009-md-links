const { checkAbsolute, pathExists, readFiles, validateLinks } = require('./data');

function mdLinks(filePath, validate = false) {
  return new Promise((resolve, reject) => {
    
    const absolutePath = checkAbsolute(filePath);

    if (!pathExists(absolutePath)) {
      reject(new Error('Path does not exist'));
      return;
    } 

    readFiles(absolutePath)
    .then((links) => {
      if (links.length > 0) {
        if (validate) {
          resolve(validateLinks(links));
        } else {
          resolve(links);
        }
      } else {
          reject(new Error('No links in the file.'))
        }
        return;
      })
/*      .catch((error) => {
        reject(new Error('There was a problem reading the file.'))
      }) */
  });
}

module.exports = { mdLinks };