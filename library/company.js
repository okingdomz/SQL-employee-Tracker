const inquirer = require('inquirer');
const db = require('../db/connect.js');
const cTable = require('console.table');

//  creating prompt

const startInquirer = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'toDo',
            message: 'what would you like to select?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add role',
                'Add department',
                'Add employee',
                'Update an employee role',
                'Remove an employee',
                'Remove a department',
                'Remove a role',
                'Exit'

            ]
        }

    ])
    .then(answers => {
        const nextPrompt = answers.toDo;
        if (nextPrompt === "View all departments") {
            viewDepartments();
        };

        if (nextPrompt === "View all roles") {
            viewRoles();
        };

        if (nextPrompt === "View all employees") {
            viewEmployees();
        };

        if (nextPrompt === "Add role") {
            addRole();
        };

        if (nextPrompt === "Add department") {
            addDepartment();
        };

        if (nextPrompt === "Add employee") {
            addEmployee();
        };

        

        if (nextPrompt === "Update an employee roles") {
            updateEmployeeRole();
        };

        

        if (nextPrompt === "Remove an employee") {
            removeEmployee();
        };

        if (nextPrompt === "Remove a department") {
            removeDepartment();
        };

        if (nextPrompt === "Remove a role") {
            removeRole();
        };
        if (nextPrompt === 'Exit') {
            process.exit();
        };
    })
};
const viewDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log('\n');
        console.table(rows);
        return startInquirer();
    });
};
const viewRoles = () => {
    const sql = `SELECT roles.id, 
                roles.title, 
                roles.salary, 
                departments.name AS department
                FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log('\n');
        console.table(rows);
        return startInquirer();
    });
};
const viewEmployees = () => {
    const sql = `SELECT employees.id, 
                employees.first_name, 
                employees.last_name,
                roles.title AS title,
                roles.salary AS salary,
                departments.name AS department,
                CONCAT (manager.first_name, " ", manager.last_name) AS manager 
            FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN  departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON employees.manager_id = manager.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log('\n');
        console.table(rows);
        return startInquirer();
    });
};
// adding department
const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "name of the department?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                
                } else {
                    console.log('enter another name');
                    return false;
                };
            }
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO departments (name)
        VALUES (?)`;

        const params = answer.name;
        db.query(sql, params, (err) => {
            if (err) {
                throw err;
            }
            console.log('department added');
            return viewDepartments();
        });
    });
};
// adding role
const addRole = () => {
    return inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "name of the role",
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log("enter another name");
            return false;
          };
        }
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
        validate: salaryInput => {
          if (isNaN(salaryInput)) {
            console.log("Please enter a salary");
            return false;
          } else {
            return true;
          };
        }
      }
    ])
    .then (answer => {
        const params = [answer.title, answer.salary];
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const departments = rows.map(({name, id}) => ({name: name, value: id}));
          inquirer.prompt([
            {
              type: "list",
              name: "department",
              message: "what department are you in?",
              choices: departments
            }
          ])
          .then(departmentAnswer => {
            const department = departmentAnswer.department;
            params.push(department);
            const sql = `INSERT INTO roles (title, salary, department_id)
              VALUES (?, ?, ?)`;
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Role added!");
              return viewRoles();
            });
          });
        });
      });
    };
//  adding employee 
const addEmployee = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "employee's first name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                
                } else {
                    console.log('enter another name');
                    return false;
                };
            }
        },
        {
            type: "input",
            name: 'lastName',
            message: "employee's last name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('enter another name');
                    return false;
                };
            }
        }
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName];
        const sql = `SELECT * FROM roles`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            const roles = rows.map(({title, id}) => ({name: title, value: id}));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'role of the employee?',
                    choices: roles
                }

            ])
            .then(roleAnswer => {
                const role = roleAnswer.role;
                params.push(role);
                const sql = `SELECT * FROM employees`;
                db.query(sql, (err, rows) => {
                  if (err) {
                    throw err;
                  }
                  const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
                  managers.push({name: "No manager", value: null});
                  inquirer.prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "who is this employee's manager?",
                      choices: managers
                    }
                  ])
                  .then(managerAnswer => {
                    const manager = managerAnswer.manager;
                    params.push(manager);
                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
                    db.query(sql, params, (err) => {
                      if (err) {
                        throw err;
                      }
                      console.log("employee added!");
                      return viewEmployees();
                    });
                  });
                });
              });
            });
          });
        };

// update employee roles
const updateEmployeeRole = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'which employee would you like to update for their role?',
            choices: employees
        }
    ])
    .then(employeeAnswer => {
        const employee = employeeAnswer.employee;
        const params = [employee];
        const sql = `SELECT title, id FROM roles`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const roles = rows.map(({title, id}) => ({name: title, value: id}));
          inquirer.prompt([
            {
              type: "list",
              name: "role",
              message: "What is the new role of this employee?",
              choices: roles
            }
          ])
          .then(rolesAnswer => {
            const role = rolesAnswer.role;
            params.unshift(role);
            const sql = `UPDATE employees
                          SET role_id = ?
                          WHERE id = ?`
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Employee updated!");
              return viewEmployees();
            });
          });
        });
      });
    });
  };

  const removeEmployee = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'which employee are we removing?',
                choices: employees
            }
        ])
        .then(employeeAnswer => {
            const employee = employeeAnswer.employee 
            const params = employee;
            const sql = `DELETE FROM employees
                        WHERE id = ?`
            db.query(sql, params, (err) => {
                if (err) {
                    throw err;
                }
                console.log('employee removed');
                return viewEmployees();
            });
        });
    });
  };
  const removeDepartment = () => {
    const sql = `SELECT * FROM departments`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const departments = rows.map(({name, id}) => ({name: name, value: id}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'which department are we removing?',
                choices: departments
            }
        ])
        .then(departmentAnswer => {
            const department = departmentAnswer.department 
            const params = department;
            const sql = `DELETE FROM departments
                        WHERE id = ?`
            db.query(sql, params, (err) => {
                if (err) {
                    throw err;
                }
                console.log('Department removed');
                return viewDepartments();
            });
        });
    });
  };
  const removeRole = () => {
    const sql = `SELECT id, title FROM roles`
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        const roles = rows.map(({title, id}) => ({name: title, value: id}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'which role are we removing?',
                choices: roles
            }
        ])
        .then(roleAnswer => {
            const role = roleAnswer.role 
            const params = role;
            const sql = `DELETE FROM roles
                        WHERE id = ?`
            db.query(sql, params, (err) => {
                if (err) {
                    throw err;
                }
                console.log('Role removed');
                return viewRoles();
            });
        });
    });
  };

  module.exports = startInquirer;

