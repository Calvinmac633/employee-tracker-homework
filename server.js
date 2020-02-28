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
                "Update Employee Role",
                // "Update Employee Manager",
                "View All Roles",
                "View All Departments",
                "Add Department",
                "Add Role",
                "Remove Role",
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
                case "Add Department":
                    addDepartment();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "Remove Role":
                    removeRole();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
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
                    message: "Select an employee to remove...",
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
                console.log(answer.department)
                let department = answer.depart;
                for (let i = 0; i < res.length; i++) {
                    switch (department) {
                        case res[i].department:
                            department = i + 1;
                            break;
                    }
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

function addDepartment() {
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
                    name: "name",
                    type: "input",
                    message: "What is the name of the new department?"
                }
            ])
            .then(function (answer) {
                console.log(answer.title)

                let query = `INSERT INTO department SET ?`;
                // "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)"
                connection.query(query,
                    {
                        name: answer.name
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

function viewRoles() {
    //
    const query =
        "SELECT * FROM role"

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employees viewed!\n");

        runSearch();
    });
}

function viewDepartments() {
    //
    const query =
        "SELECT * FROM department"

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employees viewed!\n");

        runSearch();
    });
}

function removeRole() {
    const query = "SELECT id, title FROM role";
    connection.query(query, function (err, res) {
        if (err) {
            connection.log(err)
        }
        console.log(res)
        inquirer
            .prompt([
                {
                    name: "roleRemove",
                    type: "rawlist",
                    message: "Select a role to remove...",
                    choices: function () {
                        if (err) {
                            console.log(err)
                        }
                        let choiceArray = [];
                        for (let i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].title);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (answer) {
                console.log(answer.roleRemove)
                const query = "DELETE FROM role WHERE ?";
                connection.query(query, [{ title: answer.roleRemove }], function (err, res) {
                    if (err) throw err;
                    console.log("EMPLOYEE HAS BEEN DELETED");
                    runSearch();
                })
            })
    })
}

function updateEmployeeRole() {
    // const query = "SELECT id, first_name, last_name, role_id FROM employee";
    const query =
        // `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS dept_name, 
        // CONCAT(emp.first_name, ' ', emp.last_name) AS manager
        // FROM employee e
        // LEFT JOIN role r
	    // ON e.role_id = r.id
        // LEFT JOIN department d
        // ON d.id = r.department_id
        // LEFT JOIN employee emp
        // ON emp.id = e.manager_id`;
        `SELECT r.id, r.title, e.first_name, e.last_name, e.role_id
        FROM role r
        LEFT JOIN employee e
        ON r.id = e.role_id`
        // `SELECT e.first_name, e.last_name, e.role_id, r.id, r.title
        // FROM employee e
        // LEFT JOIN role r
        // on e.role_id = r.id`
    connection.query(query, function (err, res) {
        if (err) {
            console.log(err)
        }
        console.table(res)
        const notNullNameArray = [];
        res.forEach(element => {
            if(element.first_name !== null) {
                notNullNameArray.push(element.first_name)
            }
        });
        console.log(notNullNameArray)
        inquirer
            .prompt([
                {
                    name: "update",
                    type: "rawlist",
                    message: "Select an employee to update...",
                    choices: notNullNameArray
                },
                {
                    name: "newRole",
                    type: "rawlist",
                    message: "What is their new role?",
                    choices: function () {
                        // const query = "SELECT * FROM role";
                        // connection.query(query, function (err, result) {
                        //     if (err) {
                        //         console.log(err)
                        //     }
                            let choiceArray = [];
                            for (let i = 0; i < res.length; i++) {
                                choiceArray.push(res[i].title);
                            }
                            return choiceArray;

                        // });

                    }
                }
            ])
            .then(function (answer) {
                console.log(answer.newRole)
                console.log(res[1].title)
                let updatedRole = answer.newRole;
                switch (updatedRole) {
                    case res[0].title:
                        udaptedRole = 1;
                        break;
                    case res[1].title:
                        udaptedRole = 2;
                        break;
                    case res[2].title:
                        udaptedRole = 3;
                        break;
                    case res[3].title:
                        udaptedRole = 4;
                        break;
                    case res[4].title:
                        udaptedRole = 5;
                        break;
                    case res[5].title:
                        udaptedRole = 6;
                        break;
                    case res[6].title:
                        udaptedRole = 7;
                        break;
                    default:
                        break;
                }
                console.log(udpatedRole)
                const query = "UPDATE employee SET role_id = ?? WHERE first_name = ??";
                connection.query(query, [udpatedRole, answer.update], function (err, res) {
                    if (err) throw err;
                    console.log("Role has been updated");
                    runSearch();
                })
            })
    })
}