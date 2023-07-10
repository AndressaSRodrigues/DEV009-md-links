const { getExtension, checkAbsolute } = require('../data.js');
const { mdLinks } = require('../index.js');
const path = 'testing_files/testing-links.md';
const noLinks = 'testing_files/test-nolinks.md';
const empty = 'testing_files/test-empty.md';

describe('mdLinks', () => {

it('should be a function that returns a promise', () => {
    expect (typeof mdLinks).toBe('function');
  })

  it('should return an error if the path does not exist', () => {
    return expect(mdLinks('path.md')).rejects.toBe('Path does not exist');
  })

  it('should throw an error if the file is not .md', () => {
    return expect(mdLinks('testing_files/testing.html')).rejects.toEqual('File is not a Markdown file');
  })

  it('should throw an error message if there are no links in the file', () => {
    return expect(mdLinks(noLinks)).rejects.toEqual('No links in the file.');
  })

  it('should return an array with the links in an md file', () => {
    return expect(mdLinks(path)).resolves.toEqual([
        {
          href: 'https://nodejs.org/',
          text: 'Node.js',
          file: 'C:\\Users\\deehr\\Documents\\GitHub\\DEV009-md-links\\testing_files\\testing-links.md'
        },
        {
          href: 'https://www.npmjs.com/',
          text: 'npm',
          file: 'C:\\Users\\deehr\\Documents\\GitHub\\DEV009-md-links\\testing_files\\testing-links.md'
        },
        {
          href: 'https://javascript.info/',
          text: 'JavaScript Info',
          file: 'C:\\Users\\deehr\\Documents\\GitHub\\DEV009-md-links\\testing_files\\testing-links.md'
        },
        {
          href: 'https://nodejs.org/api/fs',
          text: 'File System | Node',
          file: 'C:\\Users\\deehr\\Documents\\GitHub\\DEV009-md-links\\testing_files\\testing-links.md'
        }
      ])
  })
});