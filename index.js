/*module.exports = () => {
  // ...
};*/

const fs = require('fs');
const path = require('path');

//Read a file
fs.readFile('testing_files/testing-links.md', 'utf8', (err, data) => {
  if (err) {
    console.log(err);
  }
  console.log(data);
});

//Extension
const filePath = 'testing_files/testing.html';
const extension = path.extname(filePath);
console.log(extension);

//Read directory synchronous
const files = fs.readdirSync('testing_files');
console.log(files);

//Join paths
const join = path.join('testing_files', 'testing-links.md');
console.log(join);