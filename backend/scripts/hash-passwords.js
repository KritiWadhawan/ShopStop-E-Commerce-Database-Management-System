// After 02_seed.sql runs, all users have a placeholder password_hash.
// This script replaces it with a real bcrypt hash for "password123",
// so you can log in via /api/auth/login with any seeded email and that
// password.
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/db.js';

const hash = await bcrypt.hash('password123', 10);
await pool.query('UPDATE user SET password_hash = ?', [hash]);
console.log('✔ All seeded users now have password = password123');
await pool.end();
