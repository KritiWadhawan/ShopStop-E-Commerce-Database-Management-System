import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool, query, callProc } from '../config/db.js';
import { signToken, authRequired } from '../middleware/auth.js';

const r = Router();

// POST /api/auth/register
r.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'buyer' } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ error: 'Missing fields' });

    const hash = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    try {
      await conn.query('SET @new_id := 0');
      await conn.query(
        'CALL sp_register_user(?,?,?,?,?, @new_id)',
        [name, email, phone, hash, role]
      );
      const [[{ '@new_id': uid }]] = await conn.query('SELECT @new_id');
      const user = { user_id: uid, name, role };
      res.status(201).json({ token: signToken(user), user });
    } finally { conn.release(); }
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Email already registered' });
    next(e);
  }
});

// POST /api/auth/login
r.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const rows = await query('SELECT * FROM user WHERE email = ?', [email]);
    if (!rows.length)
      return res.status(401).json({ error: 'Invalid credentials' });

    const u = rows[0];
    const ok = await bcrypt.compare(password || '', u.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      token: signToken(u),
      user: { id: u.user_id, name: u.name, email: u.email, role: u.role,
              phone: u.phone, avatar: u.avatar_url }
    });
  } catch (e) { next(e); }
});

// GET /api/auth/me
r.get('/me', authRequired, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT u.user_id AS id, u.name, u.email, u.phone, u.role, u.avatar_url AS avatar,
              s.shop_id AS shopId
         FROM user u
         LEFT JOIN shop s ON s.seller_user_id = u.user_id
        WHERE u.user_id = ?`, [req.user.uid]);
    res.json(rows[0] || null);
  } catch (e) { next(e); }
});

export default r;
