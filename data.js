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

  if (isDirectory) { //check if it is a directory
    const files = readPath(filePath); //get each file in the directory
    const allFiles = files.map(file => readFiles(file)); //reads each file found
    if (allFiles.length === 0) { //if the directory is empty it throws an error
      throw new Error ('The directory is empty')
    } 
    return Promise.all(allFiles)
    .then((links) => links.flat());//returns a promise with the links in each file, then if returns a single array with all elements(links)
  } 
  return readFiles(filePath); //if the path is a file, it straight calls readFiles
}

//The flat() method creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.

function readPath(filePath){
  const arrayAllPaths = [];
	const files = fs.readdirSync(filePath); //read each file in the directory
	files.forEach(file => {
    const fullPath = path.join(filePath, file); //joins each path (folder + file name)
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()){ //checks if the content of a directory is a file or another directory
			const sub = readPath(fullPath); //reads the subdirectory (recursive)
      arrayAllPaths.push(...sub); //adds the files in this *new* directory in the array
		} else if (fileExtension(fullPath) === '.md') { //if the content of the directory is a file it checks if it is an md
			arrayAllPaths.push(fullPath); //pushes the files into the allFiles array
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
      'Broken': arr.filter((link) => link.statusText === 'Fail').length,
  }
}

module.exports = { checkAbsolute, pathExists, readPath, readFiles, validateLinks, getContent, stats, statsValidate }