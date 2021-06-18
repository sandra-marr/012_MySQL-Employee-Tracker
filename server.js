const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');


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

//code to start the application
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

//variables and associated functions to compare inquirer response to table data
const managerArray = [];
const manager_list = [];
const departmentArray = [];
const department_list = [];
const roleArray = [];
const role_list = [];
const employeeArray = [];
const employee_list = [];

    
var populateManagerArray = () => {
  connection.query("SELECT * FROM employee WHERE role_id = 6", (err, results) => {
    if (err) throw err;

    results.forEach(({ id, first_name, last_name }) => {
      managerArray.push({id: id, managerName: first_name + " " + last_name});
    })
    return managerArray;
})
};

var populateManager_list = () => {
  connection.query("SELECT * FROM employee WHERE role_id = 6", (err, results) => {
    if (err) throw err;
    
    results.forEach(({ first_name, last_name }) => {
      manager_list.push(first_name + " " + last_name);
    })
    return manager_list;
  })
};
    
var populateDepartmentArray = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

      results.forEach(({ id, name }) => {
        departmentArray.push({id: id, departmentName: name });
      })
    return departmentArray;
})
};

var populateDepartment_list = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

    results.forEach(({ id, name }) => {
      department_list.push(name);
    })
    return department_list;
})
};
 
var populateRoleArray = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;

    results.forEach(({ id, title, department_id}) => {
      roleArray.push({id: id, title: title, department_id: department_id });
    })
    return roleArray;
 })
};

var populateRole_list = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;

    results.forEach(({ title }) => {
      role_list.push(title); 
    })
    return role_list;
})
};

var populateEmployeeArray = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;

    results.forEach(({ id, first_name, last_name }) => {
      employeeArray.push({id: id, employeeName: first_name + " " + last_name});
    })
    return employeeArray;
  })
};

var populateEmployee_list = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    
    results.forEach(({ first_name, last_name }) => {
      employee_list.push(first_name + " " + last_name);
    })
    return employee_list;
  })
};

//Code for inquirer and mysql interaction
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

const viewByManager = () => {

  populateManagerArray();
  populateManager_list();

  connection.query("SELECT * FROM employee WHERE role_id = 6", (err, results) => {
    if (err) throw err;

    inquirer
      .prompt ([
        {
          type: "list",
          name: "managerList",
          message: "Please select a manager from the list below to view their team.",
          choices: manager_list, 
        },
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

const viewByDepartment = () => {

  populateDepartmentArray();
  populateDepartment_list();
 
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

    inquirer
      .prompt ([
        {
          type: "list",
          name: "departmentList",
          message: "Please select a department from the list below to view department members.",
          choices: department_list,
        },
    
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

const addDepartment = () => {

  console.log("This is where you will update an employee's role");

  menu();

};

const addRole = () => {

  console.log("This is where you will update an employee's role");

  menu();

};

const addEmployee = () => {
  populateManager_list();
  populateRole_list();
  populateRoleArray();
  populateManagerArray();

  connection.query("SELECT * FROM employee WHERE role_id = 6", (err, results) => {
    if (err) throw err;
 
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Please enter the Employee's first name.",
        },
        {
          name: "lastName",
          type: "input",
          message: "Please enter the Employee's last name.",
        },
        {
          name: "role",
          type: "list",
          message: "Please select the Employee role from the list below.",
          choices: role_list,
        },
        {
          name: "manager",
          type: "list",
          message: "Please assign a manager from the list below.",
          choices() {
            const choiceArray = [];
            results.forEach(({ first_name, last_name }) => {
              choiceArray.push(first_name + " " + last_name);
            });
            return choiceArray;
          }
        },
      ])
      .then((answer) => {

        var roleId;

        roleArray.forEach ((item)=>{
          if(item.title === answer.role) {
            return roleId = item.id;
          }
        })

      var managerId; 

      managerArray.forEach ((item)=>{
        if(item.managerName === answer.manager) {
          return managerId = item.id;
        }
      })
  
      connection.query("INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: roleId,
          manager_id: managerId,
        },
        (err) => {
          if (err) throw err;
          menu();

        });
    });
  })
};

const removeEmployee = () => {

  populateEmployeeArray();
  populateEmployee_list();
  
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeList",
          message: "Please select an employee to remove.",
          choices: employee_list,
        }
    ])
    .then ((answer) => {
      
      var employeeID;

      employeeArray.forEach ((item)=>{
        if(item.employeeName === answer.employeeList) {
          return employeeID = item.id;
        }
      })

      connection.query("DELETE FROM employee WHERE ?",
        {
          id: employeeID,
        },
        (err) => {
          if (err) throw err;
          menu();

        });
    })
  })
};

const removeRole = () => {

};

const removeDepartment = () => {

};

const updateRole = () => {

  console.log("This is where you will update an employee's role");

  menu();

};

const updateManager = () => {

  console.log("This is where you will update an employee's manager");

  menu();

};

const viewDepartmentBudget = () => {};

// View departments, roles,