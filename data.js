const path = require('path');
const fs = require('fs');

function checkAbsolute(fp) {
  let pathInput;
  if (path.isAbsolute(fp)) {
    return fp
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
      } else{
        resolve(getLinks(data, fp));
      }
    });
  });
}

function getLinks(data, fp) {
  const regex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
  const links = [];
  let match;

  while ((match = regex.exec(data)) !== null) {
    const text = match[1];
    const href = match[2];
    links.push({ href, text, file: fp });
  }

  return links;

}

module.exports = { checkAbsolute, pathExists, getExtension, readFiles }