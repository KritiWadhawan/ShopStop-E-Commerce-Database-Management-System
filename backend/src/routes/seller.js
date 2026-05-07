import { Router } from 'express';
import { pool, query } from '../config/db.js';
import { authRequired, roleRequired } from '../middleware/auth.js';

const r = Router();
r.use(authRequired, roleRequired('seller','admin'));

// GET /api/seller/dashboard
r.get('/dashboard', async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query('CALL sp_seller_dashboard(?)', [req.user.uid]);
      // mysql2 returns [resultSet1, resultSet2, packet]; first two are KPIs and topProducts
      res.json({
        kpis:        results[0]?.[0] || null,
        topProducts: results[1] || [],
      });
    } finally { conn.release(); }
  } catch (e) { next(e); }
});

// GET /api/seller/orders         (orders for seller's shop)
r.get('/orders', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT * FROM vw_order_summary
        WHERE shop_id = (SELECT shop_id FROM shop WHERE seller_user_id = ?)
        ORDER BY created_at DESC`, [req.user.uid]);
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/seller/listings
r.get('/listings', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT * FROM vw_listing_full
        WHERE shop_id = (SELECT shop_id FROM shop WHERE seller_user_id = ?)`,
      [req.user.uid]);
    res.json(rows);
  } catch (e) { next(e); }
});

// PATCH /api/seller/listings/:id    { price, stockCount }
r.patch('/listings/:id', async (req, res, next) => {
  try {
    const { price, stockCount } = req.body;
    await query(
      `UPDATE shop_product
          SET price       = COALESCE(?, price),
              stock_count = COALESCE(?, stock_count)
        WHERE listing_id = ?
          AND shop_id = (SELECT shop_id FROM shop WHERE seller_user_id = ?)`,
      [price ?? null, stockCount ?? null, req.params.id, req.user.uid]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default r;
