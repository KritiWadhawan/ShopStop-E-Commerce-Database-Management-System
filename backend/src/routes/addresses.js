import { Router } from 'express';
import { pool, query } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();
r.use(authRequired);

// GET /api/addresses
r.get('/', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT a.address_id AS id, a.label, a.is_default AS isDefault,
              l.latitude, l.longitude, l.address_line AS address,
              l.city, l.state, l.zip_code AS zipCode
         FROM address a JOIN location l ON l.location_id = a.location_id
        WHERE a.user_id = ?`, [req.user.uid]);
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/addresses { label, latitude, longitude, address, city, state, zipCode, isDefault }
r.post('/', async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { label, latitude, longitude, address, city, state, zipCode, isDefault } = req.body;
    await conn.beginTransaction();
    const [locRes] = await conn.query(
      `INSERT INTO location (latitude, longitude, address_line, city, state, zip_code)
       VALUES (?,?,?,?,?,?)`,
      [latitude, longitude, address, city, state, zipCode]);
    const [addrRes] = await conn.query(
      `INSERT INTO address (user_id, label, location_id, is_default)
       VALUES (?,?,?,?)`,
      [req.user.uid, label, locRes.insertId, isDefault ? 1 : 0]);
    if (isDefault) {
      await conn.query(
        `UPDATE address SET is_default = (address_id = ?)
          WHERE user_id = ?`, [addrRes.insertId, req.user.uid]);
    }
    await conn.commit();
    res.status(201).json({ id: addrRes.insertId });
  } catch (e) { await conn.rollback(); next(e); }
  finally { conn.release(); }
});

export default r;
