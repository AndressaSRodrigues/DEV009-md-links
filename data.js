const path = require('path');
const fs = require('fs');
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
    if (allFiles.length === 0) {
      throw new Error ('The directory is empty')
    } return Promise.all(allFiles).then((links) => [].concat(...links));
  } return readFiles(filePath);

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
		} else if (fileExtension(fullPath) === '.md') {
			allFiles.push(fullPath);
		}
	});
	return allFiles
}

function readFiles(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (fileExtension(filePath) === '.md') {
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
        status: error.response.status, //status: error.response ? error.response.status : 'no response'
        statusText: 'Fail'
      }
    })
  })

  return Promise.all(validatePromises)
}

module.exports = { checkAbsolute, pathExists, readPath, readFiles, validateLinks, getContent }