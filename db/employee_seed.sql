DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL
);

CREATE TABLE employee (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT
);

CREATE TABLE `role` (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL
); 


INSERT INTO department (name)
VALUES ("Engineering"), ("Accounting"), ("Human Resources"), ("Corporate");

INSERT INTO `role` (title, salary, department_id)
VALUES 
("Junior Engineer", 60000.00, 1), 
("Senior Engineer", 80000.00, 1), 
("Junior Accountant", 65000.00, 2), 
("Senior Accountant", 85000.00, 2), 
("HR Representative", 50000.00, 3), 
("Manager", 90000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Sally", "Park", 1, 1), 
("Mitch", "Fuller", 2, 1), 
("Kim", "Lynch", 4, 2), 
("Mitch", "Fuller", 2, 2),
("John","Smith", 6, ), 
("Jane","Doe", 6), 
("Alex", "Cooper", 6);


--  View all employees: the first join should return a table with id first name, last name, title, department, salary, manager name

SELECT 
employee.id, 
employee.first_name, 
employee.last_name, 
CONCAT (manager.first_name, " ", manager.last_name) AS manager, role.title AS title, role.salary AS salary, department.name AS department
    FROM employee
    JOIN role on employee.role_id = role.id 
    JOIN department on role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id

-- View all employees by manager - return the same join as above, but sort by manager

-- View all employees by department - return the same join as above, but sort by department

--
