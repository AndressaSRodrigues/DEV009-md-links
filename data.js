const path = require('path');
const fs = require('fs');
const axios = require('axios').default;

function checkAbsolute(filePath) {
  return path.resolve(filePath);
}

function pathExists(filePath) {
  return fs.existsSync(filePath)
}

function getContent(filePath) {
  const isDirectory = fs.statSync(filePath).isDirectory();
  const isFile = fs.statSync(filePath).isFile();

  if (isDirectory) {
    const files = readPath(filePath);
    const allFiles = files.map(file => readFiles(file));
    return Promise.all(allFiles).then((links) => [].concat(...links));
  } else if (isFile) {
    return readFiles(filePath);
  }
}

function readPath(filePath){
  const allFiles = [];
	const files = fs.readdirSync(filePath);
	files.forEach(file => {
    const fullPath = path.join(filePath, file);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			const sub = readPath(fullPath);
      allFiles.push(...sub);
		} else {
			allFiles.push(fullPath);
		}
	});
	return allFiles
}

function readFiles(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      const fileExtension = path.extname(filePath);
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
        status: error.response ? error.response.status : 'no response',
        statusText: 'Fail'
      }
    })
  })

  return Promise.all(validatePromises)
}

module.exports = { checkAbsolute, pathExists, readFiles, validateLinks, getContent }