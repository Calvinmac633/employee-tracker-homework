DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(15,0)
  department_id INT(3,0) NOT NULL,
  PRIMARY KEY (id)
)

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT(3,0) NOT NULL,
  manager_id INT(3,0) NOT NULL,
  PRIMARY KEY (id)
)

INSERT INTO department (name)
VALUES ("Accounting", "Finance", "Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 60, 1), ("Analyst", 70, 2), ("Lawyer", 80, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Calvin", "Macintosh", 2, 1);