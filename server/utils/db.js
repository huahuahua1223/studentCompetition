const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hjy20031223.',
  database: 'nodejs'
});

module.exports = db;