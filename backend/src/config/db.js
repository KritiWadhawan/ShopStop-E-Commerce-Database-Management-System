import mysql from 'mysql2/promise';
import 'dotenv/config';

export const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'shopstop',
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: false,
  decimalNumbers: true,
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function callProc(name, params = []) {
  const placeholders = params.map(() => '?').join(',');
  const [rows] = await pool.query(`CALL ${name}(${placeholders})`, params);
  return rows;
}
