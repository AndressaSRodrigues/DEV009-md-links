const { checkAbsolute, pathExists, validateLinks, getContent } = require('./data');

function mdLinks(filePath, options = false) {
  return new Promise((resolve, reject) => {
    
    const absolutePath = checkAbsolute(filePath);

    if (!pathExists(absolutePath)) {
      reject(new Error('Path does not exist'));
      return;
    } 

    getContent(absolutePath)
    .then((links) => {
      if (links.length > 0) {
        if (options.validate === true) {
          resolve(validateLinks(links));
        } else {
          resolve(links);
        }
      } else {
          reject(new Error('No links in the file.'))
        }
        return;
      })
    .catch(() => {
        reject(new Error('There was a problem reading the file.'))
      })
  });
}

module.exports = { mdLinks };