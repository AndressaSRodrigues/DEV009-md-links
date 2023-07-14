const { mdLinks } = require('./index');

const path = 'testing_files/testing-links.md';
const noLinks = 'testing_files/test-nolinks.md';
const projectReadMe = 'README.md'

mdLinks(path, true)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });