#!/usr/bin/env node
const { mdLinks } = require('./index');
const { stats, statsValidate } = require('./data')
const gradient = require('gradient-string');
const colors = {
  1: gradient('#FFA4EC', '#E047B6'),
  2: gradient('#E047B6', '#FFA4EC'),
  3: gradient('#2BA0C9', '#FFA4EC'),
  4: gradient('#2E348A', '#2BA0C9'),
};
const process = require('node:process');
const path = process.argv[2];
const options = process.argv.slice(3); // Get options only, excluding the path

if (path && options.length === 0) {
  mdLinks(path)
    .then((links) => {
      console.log(colors[3]('The following links were found:'), links)
    })
    .catch((error) => {
      console.error(error);
    });
} else {
  mdLinks(path, options)
    .then((links) => {
      if (options.includes('--stats') && options.includes('--validate')){
        console.log(colors[3]('Statistics for the validation:'),statsValidate(links))
      } else if (options.includes('--stats')) {
        console.log(colors[3]('Statistics for the links found:'), stats(links))
      } else if (options.includes('--validate')) {
        console.log(colors[3]('The following links were found and validated:'), links)
      } else {
        console.log(colors[3](`${options} is an invalid option. Please use --stats or --validate.`))
      }
    })
    .catch((error) => {
      console.error(error);
    });
}