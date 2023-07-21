#!/usr/bin/env node
const { mdLinks } = require('./index');
const { stats, statsValidate } = require('./data')
const process = require('node:process');
const path = process.argv[2];
const options = process.argv.slice(3); // Get options only, excluding the path

if (path && options.length === 0) {
  mdLinks(path)
    .then((links) => {
      console.log(links)
    })
    .catch((error) => {
      console.error(error);
    });
} else {
  mdLinks(path, options)
    .then((links) => {
      if (options.includes('--stats') && options.includes('--validate')){
        console.log(statsValidate(links))
      } else if (options.includes('--stats')) {
        console.log(stats(links))
      } else if (options.includes('--validate')) {
        console.log(links)
      } else {
        console.log('Invalid option. Please use --stats or --validate.')
      }
    })
    .catch((error) => {
      console.error(error);
    });
}