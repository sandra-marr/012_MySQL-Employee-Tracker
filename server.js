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
            "View all roles",
            "View all departments",
            "View all employees by Manager", 
            "View all employees by Department", 
            "Add employee", 
            "Add role", 
            "Add department",
            "Remove employee", 
            "Remove role",
            "Remove department",
            "Update employee role", 
            "Update employee manager",
            "View department budget",
            "Exit"
          ]
      }
    ])
    .then ((answer) => {
      switch (answer.menu_choices) {
        case "View all employees":
          viewAllEmployees()
          break;
        case "View all roles":
          viewAllRoles()
          break;
        case "View all departments":
          viewAllDepartments()
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
        case "Add role":
          addRole()
          break;
        case "Add department":
          addDepartment()
          break;
        case "Remove employee":
          removeEmployee()
          break;
        case "Remove role":
          removeRole()
          break;
        case "Remove department":
          removeDepartment()
          break;
        case "Update employee role":
          updateRole()
          break;
        case "Update employee manager":
          updateManager()
          break;
        case "View department budget":
          viewDepartmentBudget()
          break;
        case "Exit":
          connection.end();
      } 
    })
}

//variables and associated functions to compare inquirer response to table data
let managerArray = [];
let manager_list = [];
let departmentArray = [];
let department_list = [];
let roleArray = [];
let role_list = [];
let employeeArray = [];
let employee_list = [];

    
var populateManagerArray = () => {
  connection.query("SELECT * FROM employee WHERE role_id = 6", (err, results) => {
    if (err) throw err;

    managerArray = [];

    results.forEach(({ id, first_name, last_name }) => {
      managerArray.push({id: id, managerName: first_name + " " + last_name});
    })
    return managerArray;
})
};

var populateManager_list = () => {
  connection.query("SELECT * FROM employee WHERE role_id = 6", (err, results) => {
    if (err) throw err;

    manager_list = [];
    
    results.forEach(({ first_name, last_name }) => {
      manager_list.push(first_name + " " + last_name);
    })
    return manager_list;
  })
};
    
var populateDepartmentArray = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

    departmentArray = []

      results.forEach(({ id, name }) => {
        departmentArray.push({id: id, departmentName: name });
      })
    return departmentArray;
})
};

var populateDepartment_list = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;

    department_list = []

    results.forEach(({ id, name }) => {
      department_list.push(name);
    })
    return department_list;
})
};
 
var populateRoleArray = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;

    roleArray = []

    results.forEach(({ id, title, department_id}) => {
      roleArray.push({id: id, title: title, department_id: department_id });
    })
    return roleArray;
 })
};

var populateRole_list = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;

    role_list = []

    results.forEach(({ title }) => {
      role_list.push(title); 
    })
    return role_list;
})
};

var populateEmployeeArray = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;

    employeeArray = []

    results.forEach(({ id, first_name, last_name }) => {
      employeeArray.push({id: id, employeeName: first_name + " " + last_name});
    })
    return employeeArray;
  })
};

var populateEmployee_list = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    
    employee_list = []

    results.forEach(({ first_name, last_name }) => {
      employee_list.push(first_name + " " + last_name);
    })
    return employee_list;
  })
};

//Code for inquirer and mysql interaction - basic viewing
const viewAllEmployees = () => {

  connection.query(
    `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager, role.title AS title, role.salary AS salary, department.name AS department
        FROM employee
        LEFT JOIN role on employee.role_id = role.id 
        LEFT JOIN department on role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id`,
    
    function (err, res) {
      if (err) throw err;
      console.table(res);
      menu();
    });
};

const viewAllRoles = () => {

  connection.query(
    `SELECT * FROM role`,
    
    function (err, res) {
      if (err) throw err;
      console.table(res);
      menu();
    });
};

const viewAllDepartments = () => {

  connection.query(
    `SELECT * FROM department`,
    
    function (err, res) {
      if (err) throw err;
      console.table(res);
      menu();
    });
};

//Code for inquirer and mysql interaction - sorted viewing
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
        
        let managerId; 

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
          LEFT JOIN role on employee.role_id = role.id 
          LEFT JOIN department on role.department_id = department.id
          JOIN employee AS manager ON employee.manager_id = manager.id
          WHERE employee.manager_id = ${managerId}`,
        
          function (err, res) {
            if (err) throw err;
            if (res.length === 0) {
              console.log("That manager does not have any direct reports.")
            }
            else{
            console.table(res);
            }
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
        
        let departmentId;

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
          LEFT JOIN role on employee.role_id = role.id 
          JOIN department on role.department_id = department.id
          LEFT JOIN employee AS manager ON employee.manager_id = manager.id
          WHERE role.department_id = ${departmentId}`,
        
          function (err, res) {
            if (err) throw err;
            if (res.length === 0) {
              console.log("That department does not have any employees.")
            }
            else{
            console.table(res);
            }
            menu();
          });
      })
})}

//Code for inquirer and mysql interaction - adding
const addDepartment = () => {
  inquirer
      .prompt([
        {
          name: "newDepartment",
          type: "input",
          message: "Please enter the new department name.",
        },
      ])
      .then((answer) => {

      connection.query("INSERT INTO department SET ?",
        {
          name: answer.newDepartment,
        },
        (err) => {
          if (err) throw err;
          menu();

        });
    });
};

const addRole = () => {
  populateDepartmentArray();
  populateDepartment_list();
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "newRole",
          type: "input",
          message: "Please enter the new role name.",
        },
        {
          name: "newRoleSalary",
          type: "input",
          message: "Please enter the new role salary.",
        },
        {
          name: "department",
          type: "list",
          message: "Please enter the new role's department.",
          choices: department_list,
        },
      ])
      .then((answer) => {

        var departmentId; 

        departmentArray.forEach ((item)=>{
          if(item.departmentName === answer.department) {
            return departmentId = item.id;
          }
        })

        connection.query("INSERT INTO role SET ?",
          {
            title: answer.newRole,
            salary: answer.newRoleSalary,
            department_id: departmentId,
          },
          (err) => {
            if (err) throw err;
            menu();

          });
      });
})
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

        let roleId;

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

//Code for inquirer and mysql interaction - removing
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
      
      let employeeID;

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

  populateRoleArray();
  populateRole_list();
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "roleList",
          message: "Please select a role to remove.",
          choices: role_list,
        }
    ])
    .then ((answer) => {
      
      let roleID;

      roleArray.forEach ((item)=>{
        if(item.title === answer.roleList) {
          return roleID = item.id;
        }
      });
    
      connection.query("DELETE FROM role WHERE ?",
        {
          id: roleID,
        },
        (err) => {
          if (err) throw err;
        });

      connection.query(
        `UPDATE employee SET role_id = NULL WHERE role_id = ${roleID}`,
        (err) => {
          if (err) throw err;
          menu();
        });
    })
};

const removeDepartment = () => {
  populateDepartmentArray();
  populateDepartment_list();
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentList",
          message: "Please select a department to remove.",
          choices: department_list,
        }
    ])
    .then ((answer) => {
      
      let departmentID;

      roleArray.forEach ((item)=>{
        if(item.name === answer.departmentList) {
          return departmentID = item.id;
        }
      })

      connection.query("DELETE FROM department WHERE ?",
        {
          id: departmentID,
        },
        (err) => {
          if (err) throw err;
          menu();

        });

      connection.query(
        `UPDATE role SET department_id = NULL WHERE department_id = ${departmentID}`,
        (err) => {
          if (err) throw err;
          menu();
        });
    })
};

//Code for inquirer and mysql interaction - updating
const updateRole = () => {

  populateEmployeeArray();
  populateEmployee_list();
  populateRoleArray();
  populateRole_list();

  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
  inquirer
    .prompt([
        {
          type: "list",
          name: "employee",
          message: "Please select an employee to update.",
          choices: employee_list,
        }, 
        {
          type: "list",
          name: "updatedRole",
          message: "Please select a role to assign.",
          choices: role_list,
        },
    ])
    .then ((answer) => {
      
      let employeeId;

      employeeArray.forEach ((item)=>{
        if(item.employeeName === answer.employee) {
          return employeeId = item.id;
        }
      });

      let roleId;

      roleArray.forEach ((item)=>{
        if(item.title === answer.updatedRole) {
          return roleId = item.id;
        }
      });

      connection.query(
        `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`,
        (err) => {
          if (err) throw err;
          menu();
        });
    })

  })

};

const updateManager = () => {

  populateEmployeeArray();
  populateEmployee_list();
  populateManagerArray();
  populateManager_list();

  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
  inquirer
    .prompt([
        {
          type: "list",
          name: "employee",
          message: "Please select an employee to update.",
          choices: employee_list,
        }, 
        {
          type: "list",
          name: "updatedManager",
          message: "Please select a manager to assign.",
          choices: manager_list,
        },
    ])
    .then ((answer) => {
      console.log(answer);
      
      let employeeId;

      employeeArray.forEach ((item)=>{
        if(item.employeeName === answer.employee) {
          return employeeId = item.id;
        }
      });

      let managerId;

      managerArray.forEach ((item)=>{
        if(item.managerName === answer.updatedManager) {
          return managerId = item.id;
        }
      });

      connection.query(
        `UPDATE employee SET manager_id = ${managerId} WHERE id = ${employeeId}`,
        (err) => {
          if (err) throw err;
          menu();
        });
    })

  })


};

//Code for inquirer and mysql interaction - calculations
const viewDepartmentBudget = () => {
  populateDepartmentArray();
  populateDepartment_list();

  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
  
    inquirer
      .prompt([
        {
          type: "list",
          name: "departmentList",
          message: "Please select a department to review.",
          choices: department_list,
        }
    ])
    .then ((answer) => {
    
      let departmentId;

      departmentArray.forEach ((item)=>{
        if(item.departmentName === answer.departmentList) {
          return departmentId = item.id;
        }
      })
  
      connection.query(
        `SELECT 
          SUM(role.salary) Budget
          FROM employee
          JOIN role on employee.role_id = role.id 
          JOIN department on role.department_id = department.id
          WHERE role.department_id = ${departmentId}`,
      
          function (err, res) {
            if (err) throw err;
           
            console.table(res);
    
            menu();
        });
    })
  });
};
