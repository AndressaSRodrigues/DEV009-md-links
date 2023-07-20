#!/usr/bin/env node
const { mdLinks } = require('./index');
const { stats, statsValidate } = require('./data')
const process = require('node:process');
const path = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
  statsValidate: process.argv.includes('--validate') && process.argv.includes('--stats'),
};

if (path && options === undefined) {
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
    if (options.statsValidate){
      console.log(statsValidate(links))
    } else if (options.stats) {
      console.log(stats(links))
    } else {
      console.log(links)
    }
  })
  .catch((error) => {
    console.error(error);
  });
}