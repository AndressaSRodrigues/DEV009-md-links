const { readFiles, checkAbsolute } = require('../data.js');
const { mdLinks } = require('../index.js');
const path = 'testing_files\\testing-links.md';
const noLinks = 'testing_files\\test-nolinks.md';
const projectReadMe = 'C:\\Users\\deehr\\Documents\\GitHub\\DEV009-md-links\\README.md';

describe('mdLinks', () => {

it('should be a function that resolves a promise', () => {
    expect (typeof mdLinks).toBe('function');
  })

  it('should return an error if the path does not exist', () => {
    return expect(mdLinks('path.md')).rejects.toThrowError('Path does not exist');
  })

  it('should throw an error message if there are no links in the file', () => {
    return expect(mdLinks(noLinks)).rejects.toThrowError('No links in the file.');
  })

  it('should return an array with the links in an md file', () => {
    return expect(mdLinks(path)).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({
        href: expect.any(String),
        text: expect.any(String),
        file: expect.any(String),
      }),
    ]))
  })

});

describe('readFiles', () => {

  it('should throw an error if the file is not .md', () => {
    return expect(readFiles('testing_files/testing.html')).rejects.toThrowError('Not Markdown file.');
  })

});
