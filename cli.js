#!/usr/bin/env node
const { mdLinks } = require('./index');

const pathDir = 'testing_files';
const pathFile = 'testing_files\\testing-links.md';
const projectReadMe = 'README.md'

mdLinks(pathFile, true)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });