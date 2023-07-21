const path = require('path');
const fs = require('fs');
const gradient = require('gradient-string');
const colors = {
  1: gradient('#FFA4EC', '#E047B6'),
  2: gradient('#E047B6', '#FFA4EC'),
  3: gradient('#2BA0C9', '#FFA4EC'),
  4: gradient('#2E348A', '#2BA0C9'),
};
const axios = require('axios').default;

function checkAbsolute(filePath) {
  return path.resolve(filePath);
}

function pathExists(filePath) {
  return fs.existsSync(filePath)
}

function fileExtension(filePath) {
  return path.extname(filePath)
}

function getContent(filePath) {
  const isDirectory = fs.statSync(filePath).isDirectory();

  if (isDirectory) { 
    const files = readPath(filePath); 
    const allFiles = files.map(file => readFiles(file)); 
    return Promise.all(allFiles)
    .then((links) => links.flat());
  } 
  return readFiles(filePath);
}

function readPath(filePath){
  const arrayAllPaths = [];
	const files = fs.readdirSync(filePath);
	files.forEach(file => {
    const fullPath = path.join(filePath, file);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()){
			const sub = readPath(fullPath); 
      arrayAllPaths.push(...sub);
		} else if (fileExtension(fullPath) === '.md') {
			arrayAllPaths.push(fullPath);
		}
	});
	return arrayAllPaths
}

function readFiles(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (fileExtension(filePath) === '.md') {
        resolve(getLinks(data, filePath));
        } else {
        reject(colors[4]('Not Markdown. Please, enter a markdown file (.md).'))
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
        status: error.response.status, //status: error.response ? error.response.status : 'no response'
        statusText: 'Fail'
      }
    })
  })

  return Promise.all(validatePromises)
}

function stats(arr) {
  return {
      'Total': arr.length,
      'Unique': new Set(arr.map((links) => links.href)).size
  }
}

function statsValidate(arr) {
  return {
      'Total': arr.length,
      'Unique': new Set(arr.map((link) => link.href)).size,
      'OK': arr.filter((link) => link.statusText === 'OK').length,
      'Broken': arr.filter((link) => link.statusText === 'Fail').length
  }
}

module.exports = { checkAbsolute, pathExists, readPath, readFiles, validateLinks, getContent, stats, statsValidate }