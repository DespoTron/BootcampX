require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
});

const cohortName = process.argv[2] || "JUL02";
const values = [cohortName];
const queryString = `SELECT DISTINCT teachers.name as teacher, cohorts.name as cohort
    FROM teachers
      JOIN assistance_requests ON teachers.id = teacher_id
      JOIN students ON students.id = student_id
      JOIN cohorts ON cohorts.id = cohort_id
    WHERE cohorts.name = $1
    ORDER BY teacher;
`;
pool.query(queryString, values).then(res => {
  res.rows.forEach(row => {
    console.log(`${row.cohort}; ${row.teacher}`);
  });
});

// pool.query(`
// SELECT DISTINCT teachers.name as teacher, cohorts.name as cohort
// FROM teachers
// JOIN assistance_requests ON teacher_id = teachers.id
// JOIN students ON student_id = students.id
// JOIN cohorts ON cohort_id = cohorts.id
// WHERE cohorts.name = '${process.argv[2] || 'JUL02'}'
// ORDER BY teacher;
// `)
// .then(res => {
//   res.rows.forEach(row => {
//     console.log(`${row.cohort}: ${row.teacher}`);
//   })
// });