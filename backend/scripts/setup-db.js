// Run all SQL files in order against the configured MySQL server.
// Handles MySQL's `DELIMITER $$ ... $$ DELIMITER ;` blocks (used for
// stored functions, procedures and triggers) by splitting them in JS,
// because the mysql2 driver does NOT understand `DELIMITER` itself.
//
// Usage:  node scripts/setup-db.js
import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlDir   = join(__dirname, '..', 'db');

const files = readdirSync(sqlDir)
  .filter(f => f.endsWith('.sql'))
  .sort();      // 01_, 02_, ...

const conn = await mysql.createConnection({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
});

/**
 * Strip line/block comments and split a SQL script into individual
 * statements, honouring `DELIMITER` directives.
 */
function splitStatements(sql) {
  // remove block comments /* ... */
  sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');

  const lines = sql.split(/\r?\n/);
  const statements = [];
  let buffer    = '';
  let delimiter = ';';

  for (const raw of lines) {
    const trimmed = raw.trim();

    // single-line comments
    if (trimmed.startsWith('--') || trimmed.startsWith('#')) continue;

    // DELIMITER directive (client-side, not real SQL)
    const m = /^DELIMITER\s+(\S+)/i.exec(trimmed);
    if (m) {
      // flush whatever was pending under the previous delimiter
      if (buffer.trim()) statements.push(buffer.trim());
      buffer = '';
      delimiter = m[1];
      continue;
    }

    buffer += raw + '\n';

    // does this line end the current statement?
    if (buffer.trimEnd().endsWith(delimiter)) {
      let stmt = buffer.trimEnd();
      stmt = stmt.slice(0, stmt.length - delimiter.length).trim();
      if (stmt) statements.push(stmt);
      buffer = '';
    }
  }
  if (buffer.trim()) statements.push(buffer.trim());
  return statements;
}

for (const f of files) {
  const sql = readFileSync(join(sqlDir, f), 'utf8');
  process.stdout.write(`▶ ${f} ... `);
  const stmts = splitStatements(sql);
  for (const stmt of stmts) {
    try {
      await conn.query(stmt);
    } catch (e) {
      console.error(`\n  ✖ failed in ${f}:`);
      console.error('  ', e.sqlMessage || e.message);
      console.error('  ---- statement ----\n', stmt.slice(0, 400),
                    stmt.length > 400 ? '...' : '');
      throw e;
    }
  }
  console.log('ok');
}
await conn.end();
console.log('\n✔ Database loaded successfully.');
console.log('  Now run:  npm run db:seed-passwords    # replaces placeholder hashes');
