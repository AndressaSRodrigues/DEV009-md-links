#!/usr/bin/env node
const { mdLinks } = require('./index');
const { stats, statsValidate } = require('./data')
const process = require('node:process');
const path = process.argv[2];
const options = process.argv;

mdLinks(path, options)
  .then((links) => {
    if (options.includes('--validate') && options.includes('--stats')) {
      console.log(statsValidate(links));
    } else if (options.includes('--stats')){
      console.log(stats(links));
    } else {
      console.log(links);
    }
  })
  .catch((error) => {
    console.error(error);
  });