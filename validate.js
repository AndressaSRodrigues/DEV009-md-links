const axios = require('axios').default;

function validate(filePath) {
    axios.head(filePath)
    .then(response => {
      console.log(response.status);
      console.log(response.headers);
    })
    .catch(error => {
      console.error(error);
    });
  }

validate('testing_files\\testing-links.md');