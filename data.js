const path = require('path');
const fs = require('fs');
const axios = require('axios').default;

function checkAbsolute(filePath) {
  return path.resolve(filePath);
}

function pathExists(filePath) {
  return fs.existsSync(filePath)
}

function getExtension(filePath) {
  return path.extname(filePath);
}

function readFiles(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      const fileExtension = getExtension(filePath);
      if (fileExtension === '.md') {
        resolve(getLinks(data, filePath));
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
    return axios.get(link.href)
    .then((response)=> {
      return {
        text: link.text,
        href: link.href,
        file: link.file,
        status: response.status,
        statusText: response.statusText
      }
    }).catch((error) => {
      return {
        text: link.text,
        href: link.href,
        file: link.file,
        status: error.response.status,
        statusText: 'Fail'
      }
    })
  })

  return Promise.all(validatePromises)
}

module.exports = { checkAbsolute, pathExists, getExtension, readFiles, validateLinks }

/*
status: error.response.status = 404
status: error.status = undefined
In the axios library, when a request fails, the error object returned does not have a status property. 
Instead, it has a response property, which contains the HTTP response details including the status property.

So, when you access error.response.status, you are correctly retrieving the HTTP status code (e.g., 404) from the response object. 
However, when you access error.status, it returns undefined because the error object itself does not have a status property.
*/