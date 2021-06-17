const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
// look up how to better display tables here https://www.npmjs.com/package/tables

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

  //  View all employees: the first join should return a table with id, first name, last name, title, department, salary, manager name (first and last in one colmn)
  connection.query(
    `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager, role.title AS title, role.salary AS salary, department.name AS department
        FROM employee
        JOIN role on employee.role_id = role.id 
        JOIN department on role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`,
    
    function (err, res) {
      if (err) throw err;
      console.table(res);
      menu();
    });
};

const managerArray = [];
    
var populateManageArray = () => {
  connection.query("SELECT * FROM employee WHERE role_id = 6", (err, results) => {
    if (err) throw err;

  results.forEach(({ id, first_name, last_name }) => {
  managerArray.push({id: id, managerName: first_name + " " + last_name});
 
  return managerArray;

})})};

const viewByManager = () => {

  populateManageArray();

  connection.query("SELECT * FROM employee WHERE role_id = 6", (err, results) => {
    if (err) throw err;

    inquirer
      .prompt ([
        {
          type: "list",
          name: "managerList",
          message: "Please select a manager from the list below to view their team.",
          choices () {
            const choiceArray = [];
            var managerArray = [];
            results.forEach(({ id, first_name, last_name }) => {
              choiceArray.push(first_name + " " + last_name);
              managerArray.push({id: id, managerName: first_name + " " + last_name});
            });
            return choiceArray;
          },
        }
      ])
      .then ((answer) => {
        console.log(answer);

        var managerId; 

        managerArray.forEach ((item)=>{
          if(item.managerName === answer.managerList) {
            return managerId = item.id;
          }
        })

        connection.query(
          `SELECT 
          employee.id, 
          employee.first_name, 
          employee.last_name, 
          CONCAT (manager.first_name, " ", manager.last_name) AS manager, role.title AS title, role.salary AS salary, department.name AS department
          FROM employee
          JOIN role on employee.role_id = role.id 
          JOIN department on role.department_id = department.id
          JOIN employee AS manager ON employee.manager_id = manager.id
          WHERE employee.manager_id = ${managerId}`,
        
          function (err, res) {
            if (err) throw err;
            console.table(res);
            menu();
          });
      })
})}

const departmentArray = [];
    
var populateDepartmentArray = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

  results.forEach(({ id, name }) => {
  departmentArray.push({id: id, departmentName: name });
  console.log(departmentArray);
  console.log(departmentArray[0].id)
  return departmentArray;

})})};

const viewByDepartment = () => {

  populateDepartmentArray();
 
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

    inquirer
      .prompt ([
        {
          type: "list",
          name: "departmentList",
          message: "Please select a department from the list below to view department members.",
          choices () {
            const choiceArray = [];
        
            results.forEach(({ name }) => {
              choiceArray.push(name);
            });
            return choiceArray;
          },
        }
      ])
      .then ((answer) => {
        
        var departmentId;

        departmentArray.forEach ((item)=>{
          if(item.departmentName === answer.departmentList) {
            return departmentId = item.id;
          }
        })

        connection.query(
          `SELECT 
          employee.id, 
          employee.first_name, 
          employee.last_name, 
          CONCAT (manager.first_name, " ", manager.last_name) AS manager, role.title AS title, role.salary AS salary, department.name AS department
          FROM employee
          JOIN role on employee.role_id = role.id 
          JOIN department on role.department_id = department.id
          JOIN employee AS manager ON employee.manager_id = manager.id
          WHERE role.department_id = ${departmentId}`,
        
          function (err, res) {
            if (err) throw err;
            console.table(res);
            menu();
          });
      })
})}

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