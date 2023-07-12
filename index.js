const { checkAbsolute, pathExists, readFiles } = require('./data');

function mdLinks(filePath, validate) {
  return new Promise((resolve, reject) => {
    
    const absolutePath = checkAbsolute(filePath); //replace(/\\/g, '\\\\');

    if (!pathExists(absolutePath)) {
      reject(new Error('Path does not exist'));
      return;
    } 

    readFiles(absolutePath, validate).then((links) => {
      if (links.length > 0) {
        resolve(links);
        } else {
          reject(new Error('No links in the file.'))
        }

        return;
        
      })
  });
}

module.exports = { mdLinks };