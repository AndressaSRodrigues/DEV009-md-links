const { checkAbsolute, pathExists, validateLinks, getContent } = require('./data');
const { colors } = require('./colors.js');
function mdLinks(filePath, options) {
  return new Promise((resolve, reject) => {
    
    const absolutePath = checkAbsolute(filePath);

    if (!pathExists(absolutePath)) {
      reject(colors[1]('This path does not exist, enter a valid path.'));
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
          reject(colors[1]('The file is empty or there are no links to validate.'));
        }
        return;
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

module.exports = { mdLinks };