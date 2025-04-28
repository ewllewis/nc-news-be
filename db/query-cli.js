const db = require("./connection");
const inquirer = require("inquirer");

const runQuery = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "query",
        message: "Please enter your query",
      },
    ])
    .then((answers) => {
      return db.query(answers.query);
    })
    .then((result) => {
      console.table(result.rows);
      return inquirer.prompt([
        {
          type: "confirm",
          name: "again",
          message: "Would you like to enter another query?",
          default: true,
        },
      ]);
    })
    .then((answer) => {
      if (answer.again) {
        return runQuery();
      } else {
        db.end();
      }
    })
    .catch((err) => {
      console.log(err);
      db.end();
    });
};

runQuery();
