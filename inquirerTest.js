const inquirer = require('inquirer');

inquirer.prompt([{
  name: 'Name',
  type: 'Input',
  message: 'Please provide your name',
}, {
  name: 'fruit',
  type: 'list',
  message: 'Fruit you like?',
  choices: ['Papaya', 'Mango', 'Lychee', 'Apple'],
  default: 3,
}]).then((answers) => {
  console.log(`\nHi ${answers.name}. I like ${answers.fruits} too!\n`);
});