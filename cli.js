const { mdLinks } = require('./index');

const pathDir = 'testing_files';
const noLinks = 'testing_files/test-nolinks.md';
const projectReadMe = 'README.md'

mdLinks(pathDir, true)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });