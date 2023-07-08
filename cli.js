const { mdLinks } = require('./index');

mdLinks('testing_files/testing-links.md') //Fix the slash
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });
