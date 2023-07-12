const path = require('path');
const fs = require('fs');
const axios = require('axios').default;

function checkAbsolute(filePath) {
  return path.resolve(filePath);
}

function pathExists(filePath) {
  return fs.existsSync(filePath);
}

function getExtension(filePath) {
  return path.extname(filePath);
}

function readFiles(filePath, validate) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      
      const fileExtension = getExtension(filePath);
      if (fileExtension === '.md') {

        const links = getLinks(data, filePath);

        if (validate === true) {
          validateLinks(links)
          .then(links => resolve(links));
        } else {
          resolve(links);
        }

      } else {
        reject(new Error ('Not Markdown file.'))
      }
    });
  });
}

function getLinks(data, filePath) {
  const regex = /\[(.*?)\]\((https?:\/\/.*?)\)/g;
  const links = [];
  let match;

  while ((match = regex.exec(data)) !== null) {
    const text = match[1];
    const href = match[2];
    links.push({ href, text, file: filePath });
  }

  return links;

}

function validateLinks(links) {
  const validatePromises = links.map(link =>{
    return axios.head(link.href)
    .then((response)=> {
      return {
        text: link.text,
        url: link.href,
        status: response.status,
        statusText: response.statusText
      }
    }).catch((error) => {
      return {
        text: link.text,
        url: link.href,
        status: error.response.status,
        statusText: 'Fail'
      }
    })
  })

  return Promise.all(validatePromises)
}

module.exports = { checkAbsolute, pathExists, getExtension, readFiles }