-- USE employee_db;
-- INSERT INTO departments (name)
-- VALUES
-- ('Engineering'),
-- ('Sales'),
-- ('Law'),
-- ('Finance');



USE employee_db;

INSERT INTO departments (name)
VALUES 
('Engineering'),
('Sales'),
('Law'),
('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Lead Engineer', 100000, 1),
('Sales Lead', 80000, 2),
('Sales Rep', 40000, 2),
('Accountant', 120000, 4),
('Lawyer', 80000, 3),
('Legal lead', 90000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 

('Jon', 'Stark', 1, NULL),
('Darth', 'Vader', 2, NULL),
('Aragon', 'Johnson', 3, 2),
('Kill', 'Bill', 4, 3),
('Goku', 'Wukang', 5, 2), 
('Zhao', 'Yun', 6, 2), 
('Mitsuhida', 'Ishida', 5, 2); 



