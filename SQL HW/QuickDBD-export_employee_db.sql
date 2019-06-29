-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/WDpxSX
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "departments" (
    "dept_no" varchar   NOT NULL,
    "dept_name" varchar   NOT NULL,
    CONSTRAINT "pk_departments" PRIMARY KEY (
        "dept_no"
     )
);

CREATE TABLE "dept_emp" (
    "emp_no" integer   NOT NULL,
    "dept_no" varchar   NOT NULL,
    "from_date" date   NOT NULL,
    "to_date" date   NOT NULL
);

CREATE TABLE "dept_manager" (
    "dept_no" varchar   NOT NULL,
    "emp_no" integer   NOT NULL,
    "from_date" date   NOT NULL,
    "to_date" date   NOT NULL
);

CREATE TABLE "employees" (
    "emp_no" integer   NOT NULL,
    "birth_date" date   NOT NULL,
    "first_name" varchar   NOT NULL,
    "last_name" varchar   NOT NULL,
    "gender" varchar   NOT NULL,
    "hire_date" date   NOT NULL,
    CONSTRAINT "pk_employees" PRIMARY KEY (
        "emp_no"
     )
);

CREATE TABLE "salaries" (
    "emp_no" integer   NOT NULL,
    "salary" integer   NOT NULL,
    "from_date" date   NOT NULL,
    "to_date" date   NOT NULL
);

CREATE TABLE "titles" (
    "emp_no" integer   NOT NULL,
    "title" varchar   NOT NULL,
    "from_date" date   NOT NULL,
    "to_date" date   NOT NULL
);

ALTER TABLE "dept_emp" ADD CONSTRAINT "fk_dept_emp_emp_no" FOREIGN KEY("emp_no")
REFERENCES "employees" ("emp_no");

ALTER TABLE "dept_emp" ADD CONSTRAINT "fk_dept_emp_dept_no" FOREIGN KEY("dept_no")
REFERENCES "departments" ("dept_no");

ALTER TABLE "dept_manager" ADD CONSTRAINT "fk_dept_manager_dept_no" FOREIGN KEY("dept_no")
REFERENCES "departments" ("dept_no");

ALTER TABLE "dept_manager" ADD CONSTRAINT "fk_dept_manager_emp_no" FOREIGN KEY("emp_no")
REFERENCES "employees" ("emp_no");

ALTER TABLE "salaries" ADD CONSTRAINT "fk_salaries_emp_no" FOREIGN KEY("emp_no")
REFERENCES "employees" ("emp_no");

ALTER TABLE "titles" ADD CONSTRAINT "fk_titles_emp_no" FOREIGN KEY("emp_no")
REFERENCES "employees" ("emp_no");

--SCRAP WORK
SELECT emp_no, min(from_date), max(to_date)
FROM dept_emp
GROUP BY emp_no



SELECT t.title, avg(s.salary) as salary_avg
FROM titles t
LEFT JOIN salaries s ON
t.emp_no = s.emp_no
GROUP BY t.title
ORDER BY salary_avg DESC

SELECT * FROM titles

SELECT count(DISTINCT emp_no) FROM dept_emp

-- 1. list the following details of each employee: employee number, last name, first name, gender, salary
SELECT e.emp_no, e.last_name, e.first_name, e.gender, s.salary 
FROM employees as e
JOIN salaries as s ON
e.emp_no = s.emp_no;

-- 2. list employees who were hired in 1986
SELECT * FROM employees
WHERE EXTRACT(year FROM "hire_date") = 1986

-- 3. list the manager of each department with the following information: department number, department name, the managers employee number, last name, first name, and start and end employment dates
-- NOTE the below query assumes we're interested in the "Current" manager of each department
SELECT d.dept_no, d.dept_name, dm.emp_no, e.last_name, e.first_name, employ_dates.min as start_date, employ_dates.max as end_date
FROM departments d
LEFT JOIN dept_manager dm ON
d.dept_no = dm.dept_no
LEFT JOIN employees e ON
dm.emp_no = e.emp_no
LEFT JOIN 
(
	SELECT emp_no, min(from_date), max(to_date)
	FROM dept_emp
	GROUP BY emp_no
) as employ_dates ON
e.emp_no = employ_dates.emp_no
WHERE dm.to_date > now()

-- 4. list the deparment of each employee with the following information: employee number, last_name, first_name, department name
-- NOTE the below query assumes we're interested in the "Current" department of each employee
SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM employees e
LEFT JOIN dept_emp de ON
e.emp_no = de.emp_no
LEFT JOIN departments d ON
de.dept_no = d.dept_no
WHERE de.to_date > now()

-- 5. list all employees whose first name is "Hercules" and last name begins with "B"
SELECT * FROM employees
WHERE first_name = 'Hercules'
AND last_name like 'B%'

-- 6. list all employees in the Sales department, including their employee number, last name, first name and department name
SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM employees e
LEFT JOIN dept_emp de ON
e.emp_no = de.emp_no
LEFT JOIN departments d ON
de.dept_no = d.dept_no
WHERE de.to_date > now()
AND d.dept_name = 'Sales'

-- 7. list all employees in the Sales and Development departments, including their employee number, last name, first name, and dpartment name
SELECT e.emp_no, e.last_name, e.first_name, d.dept_name
FROM employees e
LEFT JOIN dept_emp de ON
e.emp_no = de.emp_no
LEFT JOIN departments d ON
de.dept_no = d.dept_no
WHERE de.to_date > now()
AND d.dept_name in ('Sales', 'Development')

-- 8. In descending order, list the frequency count of employee last names, i.e. how many employees share each last name
SELECT last_name, count(last_name) as count
FROM employees
GROUP BY last_name
ORDER BY count DESC