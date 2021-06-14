const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  port: 3306,

  user: 'root',

  password: 'password',

  database: 'employees_db',

  
});

connection.connect((err) => {
    if (err) throw err;
    
    menu();
});

const menu = () => {
  inquirer
    .prompt ([
      {
        type: "list",
        name: "menu_choices",
        message: "Please select an option from the list to get started.",
        choices: 
          [
            "View all employees", 
            "View all employees by Manager", 
            "View all employees by Department", 
            "Add employee", 
            "Remove employee", 
            "Update employee role", 
            "Update employee manager",
            "Exit"
          ]
      }
    ])
    .then ((answer) => {
      switch (answer.menu_choices) {
        case "View all employees":
          viewAllEmployees()
          break;
        case "View all employees by Manager":
          viewByManager()
          break;
        case "View all employees by Department":
          viewByDepartment()
          break;
        case "Add employee":
          addEmployee()
          break;
        case "Remove employee":
          removeEmployee()
          break;
        case "Update employee role":
          updateRole()
          break;
        case "Update employee manager":
          updateManager()
          break;
        case "Exit":
          connection.end();
      } 
    })
}

const viewAllEmployees = () => {

  console.log("This is where you will view all employees");
  
  menu();

};

const viewByManager = () => {
 
  console.log("This is where you will view all employees sorted by manager");

  menu();
};

const viewByDepartment = () => {
  
  console.log("This is where you will view all employees sorted by department");

  menu();

};

const addEmployee = () => {

  console.log("This is where you will add an employee");
  
  menu();

};

const removeEmployee = () => {

  console.log("This is where you will remove an employee");

  menu();

};

const updateRole = () => {

  console.log("This is where you will update an employee's role");

  menu();

};

const updateManager = () => {

  console.log("This is where you will update an employee's manager");

  menu();
  
};