USE employee_db;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    -- names vs name
    name VARCHAR(30) NOT NULL
    
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    -- foreign key constraints
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    CONSTRAINT fk_manager_id FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);





-- CREATE TABLE employee (
--    id INT NOT NULL AUTO_INCREMENT,
--   first_name VARCHAR(45) NULL,
--   last_name VARCHAR(45) NULL,
--   role_id INT NULL,
--   manager_id INT NULL,
--   PRIMARY KEY (id)
-- );