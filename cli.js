const { mdLinks } = require('./index');

const path = 'testing_files/testing-links.md';
const pathEmpty = 'testing_files/test-empty.md'; //Fix the slash
const noLinks = 'testing_files/test-nolinks.md';

mdLinks(path)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });