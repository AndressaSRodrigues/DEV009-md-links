const { readFiles, validateLinks, readPath, getContent, stats, statsValidate } = require('../data.js');
const { mdLinks } = require('../index.js');
const gradient = require('gradient-string');
const colors = {
  1: gradient('#FFA4EC', '#E047B6'),
  2: gradient('#E047B6', '#FFA4EC'),
  3: gradient('#2BA0C9', '#FFA4EC'),
  4: gradient('#2E348A', '#2BA0C9'),
};
const path = 'testing_files\\testing-links.md';
const noLinks = 'testing_files\\test-nolinks.md';
const options = '--validate';
/* jest.mock('axios'); */

describe('mdLinks', () => {

it('should be a function that resolves a promise', () => {
    expect (typeof mdLinks).toBe('function');
  })

  it('should return an error if the path does not exist', () => {
    return expect(mdLinks('notAFile.md')).rejects.toThrowError(colors[1]('This path does not exist, enter a valid path.'));
  })

  it('should throw an error message if there are no links in the file', () => {
    return expect(mdLinks(noLinks)).rejects.toThrowError(colors[1]('There are no links in the file.'));
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

  it('should return an array with the links in an md file', () => {
    return expect(mdLinks(path, options)).resolves.toEqual(expect.arrayContaining([
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
      ])
    })
  });

});

describe('readFiles', () => {

  it('should throw an error if the file is not .md', () => {
    return expect(readFiles('testing_files/testing.html')).rejects.toThrowError(colors[4]('Not Markdown. Please, enter a markdown file (.md).'));
  })
  
});

describe('readPath', () => {

  it('return an array with the files in a directory', () => {
    expect(readPath('testing_files')).toEqual([
      "testing_files\\test-nolinks.md",
      "testing_files\\testing-links.md",
      "testing_files\\test_dir\\testing_files_dir.md"
    ]);
});

});

describe('getContent', () => {

  it('return an array with all the links in all files in a directory', () => {
    return expect(getContent('testing_files')).resolves.toEqual(expect.arrayContaining([
      expect.objectContaining({
        href: expect.any(String),
        text: expect.any(String),
        file: expect.any(String),
      }),
    ]))
  });

  it('throw an error for an empty directory', () => {
    expect(() => getContent('empty')).toThrowError(colors[4]('The directory is empty.'));
  });
  
});

describe('stats and statsValidate', () => {
  const linksArray = [
    { href: 'link1', statusText: 'OK' },
    { href: 'link1', statusText: 'OK' },
    { href: 'link2', statusText: 'OK' },
    { href: 'link3', statusText: 'Fail' },
    { href: 'link4', statusText: 'Fail' }
  ];

  it('returns the number of total links and the number of unique links', () => {
    expect(stats(linksArray)).toEqual({ Total: 5, Unique: 4 });
  });

  it('returns the number of total links and the number of unique links', () => {
    expect(statsValidate(linksArray)).toEqual({ Total: 5, Unique: 4, OK: 3, Broken: 2 });
  });

});
