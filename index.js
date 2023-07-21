const { checkAbsolute, pathExists, validateLinks, getContent } = require('./data');
const gradient = require('gradient-string');
const colors = {
  1: gradient('#FFA4EC', '#E047B6'),
  2: gradient('#E047B6', '#FFA4EC'),
  3: gradient('#2BA0C9', '#FFA4EC'),
  4: gradient('#2E348A', '#2BA0C9'),
};

function mdLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    
    const absolutePath = checkAbsolute(filePath);

    if (!pathExists(absolutePath)) {
      reject(new Error(colors[1]('This path does not exist, enter a valid path.')));
      return;
    } 

    getContent(absolutePath)
    .then((links) => {
      if (links.length > 0) {
        if (options) {
          resolve(validateLinks(links));
        } else {
          resolve(links);
        }
      } else {
          reject(new Error(colors[1]('There are no links in the file.')));
        }
        return;
      })
  });
}

module.exports = { mdLinks };