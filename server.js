const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "rootroot",
    database: "employeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                // "View All Employees By Department",
                // "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                // "Update Employee Role",
                // "Update Employee Manager",
                // "View All Roles",
                "Add Role",
                // "Remove Role",
                // "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Employees By Department":
                    viewEmployeesDept();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Add Role":
                    addRole();
                    break;
            }
        })
}

function viewEmployees() {
    //
    const query =
        `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS dept_name, 
        CONCAT(emp.first_name, ' ', emp.last_name) AS manager
        FROM employee e
        LEFT JOIN role r
	    ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        LEFT JOIN employee emp
        ON emp.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employees viewed!\n");

        runSearch();
    });
}

function addEmployee() {
    //use query to selelect role table
    //store into a roleChoices const
    //use this to put into addEmployeePrompt
    //ask first, last, role, manager first and last

    connection.query(`SELECT * FROM role`, function (err, res) {
        if (err) throw err;
        console.log(res)
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "title",
                    type: "rawlist",
                    message: "What is the employee's title?",
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].title);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (answer) {
                console.log(answer.title)
                let title = answer.title;
                for (let i = 0; i < res.length; i++) {
                    switch (title) {
                        case res[i].title:
                            title = i + 1;
                            break;
                    }
                }
                
                let query = `INSERT INTO employee SET ?`;
                // "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)"
                connection.query(query,
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: title
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        console.log(res.insertedRows + " Rows inserted")
                        runSearch();
                    }
                )
            })
    })
}

function removeEmployee() {
    const query = "SELECT id, first_name, last_name FROM employee";
    connection.query(query, function (err, res) {
        console.log(res)
        inquirer
            .prompt([
                {
                    name: "remove",
                    type: "rawlist",
                    message: "Select and employee to remove...",
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].first_name);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (answer) {
                console.log(answer.remove)
                const query = "DELETE FROM employee WHERE ?";
                connection.query(query, [{ first_name: answer.remove }], function (err, res) {
                    if (err) throw err;
                    console.log("EMPLOYEE HAS BEEN DELETED");
                    runSearch();
                })
            })
    })
}

function addRole() {
    //use query to selelect role table
    //store into a roleChoices const
    //use this to put into addEmployeePrompt
    //ask first, last, role, manager first and last

    const query = "SELECT id, name FROM department";
    connection.query(query, function (err, res) {
        console.log(res)
    })

    connection.query(`SELECT * FROM department`, function (err, res) {
        if (err) throw err;
        console.log(res)
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the name of the new role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the role's annual salary?"
                },
                {
                    name: "department",
                    type: "rawlist",
                    message: "What is the role's department?",
                    ////////CONTINUE HERE - change title
                    choices: function () {
                        let choiceArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].name);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (answer) {
                console.log(answer.title)
                let department = answer.department;
                switch (department) {
                    case "Accounting":
                        department = 1;
                        break;
                    case "Finance":
                        department = 2;
                        break;
                    case "Legal":
                        department = 3;
                        break;
                }
                let query = `INSERT INTO role SET ?`;
                // "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)"
                connection.query(query,
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: department
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        console.log(res.insertedRows + " Rows inserted")
                        runSearch();
                    }
                )
            })
    })
}