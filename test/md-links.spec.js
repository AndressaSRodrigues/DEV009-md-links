const { readFiles, validateLinks } = require('../data.js');
const { mdLinks } = require('../index.js');
const path = 'testing_files\\testing-links.md';
const noLinks = 'testing_files\\test-nolinks.md';
/* jest.mock('axios'); */

describe('mdLinks', () => {

it('should be a function that resolves a promise', () => {
    expect (typeof mdLinks).toBe('function');
  })

  it('should return an error if the path does not exist', () => {
    return expect(mdLinks('notAFile.md')).rejects.toThrowError('Path does not exist');
  })

  it('should throw an error message if there are no links in the file', () => {
    return expect(mdLinks(noLinks)).rejects.toThrowError('No links in the file.');
  })

  it('should return an array with the links in an md file', () => {
    return expect(mdLinks(path, false)).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({
        href: expect.any(String),
        text: expect.any(String),
        file: expect.any(String),
      }),
    ]))
  })

  it('should return an array with the links in an md file', () => {
    return expect(mdLinks(path, true)).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({
        href: expect.any(String),
        text: expect.any(String),
        file: expect.any(String),
        status: expect.any(Number),
        statusText: expect.any(String)
      }),
    ]))
  })

  it('should validate links', () => {
    const links = [
      { href: 'valid-example', text: 'Valid Link', file: 'valid.md' },
      { href: 'invalid-example', text: 'Invalid Link', file: 'invalid.md' },
    ];
  
    return validateLinks(links)
    .then((results) => {
      expect(results).toEqual([
        {
          text: 'Valid Link',
          href: 'valid-example',
          file: 'valid.md',
          status: 200,
          statusText: 'OK',
        },
        {
          text: 'Invalid Link',
          href: 'invalid-example',
          file: 'invalid.md',
          status: 404,
          statusText: 'Fail',
        },
      ]);
    })
  });

});

describe('readFiles', () => {

  it('should throw an error if the file is not .md', () => {
    return expect(readFiles('testing_files/testing.html')).rejects.toThrowError('Not Markdown file.');
  })
  
  });