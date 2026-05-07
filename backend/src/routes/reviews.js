import { Router } from 'express';
import { query } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();

// GET /api/reviews/listing/:listingId
r.get('/listing/:listingId', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT r.review_id, r.rating, r.comment, r.created_at,
              u.name AS user_name, u.avatar_url AS avatar
         FROM review r JOIN user u ON u.user_id = r.user_id
        WHERE r.listing_id = ?
        ORDER BY r.created_at DESC`, [req.params.listingId]);
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/reviews   { listingId, rating, comment }
r.post('/', authRequired, async (req, res, next) => {
  try {
    const { listingId, rating, comment } = req.body;
    await query(
      `INSERT INTO review (user_id, listing_id, rating, comment)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE rating=VALUES(rating), comment=VALUES(comment)`,
      [req.user.uid, listingId, rating, comment || null]);
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

export default r;
