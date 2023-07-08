const path = require('path');
const fs = require('fs');

function checkAbsolute(fp) {
  let pathInput;
  if (path.isAbsolute(fp)) {
    pathInput = fp;
  } else {
    pathInput = path.resolve(fp);
  }
  return pathInput
}

function pathExists(fp) {
  return fs.existsSync(fp);
}

function getExtension(fp) {
  return path.extname(fp);
}

function readFiles(fp) {
  return new Promise((resolve, reject) => {
    fs.readFile(fp, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else if (!data){
        reject('File is empty');
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = { checkAbsolute, pathExists, getExtension, readFiles }