#!/usr/bin/env node
const { mdLinks } = require('./index');
const { stats, statsValidate } = require('./data')
const { colors } = require('./colors.js');
const process = require('node:process');
const path = process.argv[2];
const options = process.argv.slice(3); // Get options only, excluding the path


if (!path) {
  console.log(colors[3]('You should enter a path. You can enter a path to a file or a folder.\n\nFor example: mdlinks pathtofile.md or pathtofolder\n\nYou can also include the options --stats or --validate for further information.\n\n**Remember: mdlinks only reads markdown files.**'))
} else if (path && options.length === 0) {
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
        console.log(colors[3]('Validation statistics::'),statsValidate(links))
      } else if (options.includes('--stats')) {
        console.log(colors[3]('Number of links found:'), stats(links))
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