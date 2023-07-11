const path = require('path');
const fs = require('fs');

function checkAbsolute(fp) {
  return path.resolve(fp);
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
      const fileExtension = getExtension(fp);
      if (fileExtension === '.md') {
        resolve(getLinks(data, fp));
      } else {
        reject(new Error ('Not Markdown file.'))
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