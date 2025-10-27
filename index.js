import inquirer from 'inquirer';

inquirer
  .prompt([
    /* Pass your questions in here */
    {"message": "Type in your URL:", 
    "name": "url"}
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    console.log(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

