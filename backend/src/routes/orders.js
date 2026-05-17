import { Router } from 'express';
import { pool, query } from '../config/db.js';
import { authRequired, roleRequired } from '../middleware/auth.js';

const r = Router();
r.use(authRequired);

// POST /api/orders   { shopId, addressId }
r.post('/', async (req, res, next) => {
  try {
    const { shopId, addressId } = req.body;
    const conn = await pool.getConnection();
    try {
      await conn.query('SET @oid := 0');
      await conn.query('CALL sp_place_order(?,?,?, @oid)',
        [req.user.uid, shopId, addressId]);
      const [[{ '@oid': oid }]] = await conn.query('SELECT @oid');
      res.status(201).json({ orderId: oid });
    } finally { conn.release(); }
  } catch (e) {
    if (e.sqlState === '45000')
      return res.status(400).json({ error: e.sqlMessage });
    next(e);
  }
});

// POST /api/orders/direct
//   { shopId, addressId, items: [{ listingId, quantity }] }
// Fills the user's cart with these items then places an order in one
// shot.  Used by the frontend "Place Order" button so the demo doesn't
// have to maintain a separate cart in MySQL.
r.post('/direct', async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    const { shopId, addressId, items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'No items provided' });

    await conn.beginTransaction();

    // 1) ensure each item is in the user's cart (stock checked by sp_add_to_cart)
    for (const it of items) {
      await conn.query('CALL sp_add_to_cart(?,?,?)',
        [req.user.uid, it.listingId, it.quantity]);
    }

    // 2) place the order (triggers decrement stock atomically)
    await conn.query('SET @oid := 0');
    await conn.query('CALL sp_place_order(?,?,?, @oid)',
      [req.user.uid, shopId, addressId]);
    const [[{ '@oid': oid }]] = await conn.query('SELECT @oid');

    await conn.commit();
    res.status(201).json({ orderId: oid });
  } catch (e) {
    await conn.rollback();
    if (e.sqlState === '45000')
      return res.status(400).json({ error: e.sqlMessage });
    next(e);
  } finally { conn.release(); }
});

// GET /api/orders          (current user's orders)
r.get('/', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT * FROM vw_order_summary WHERE user_id = ?
        ORDER BY created_at DESC`, [req.user.uid]);
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/orders/:id      (with items + tracking)
r.get('/:id', async (req, res, next) => {
  try {
    const [order] = await query(
      `SELECT * FROM vw_order_summary WHERE order_id = ?`, [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Not found' });

    const items = await query(
      `SELECT oi.*, v.product_name, v.default_image_url AS image, v.shop_name
         FROM order_item oi
         JOIN vw_listing_full v ON v.listing_id = oi.listing_id
        WHERE oi.order_id = ?`, [req.params.id]);

    const tracking = await query(
      `SELECT update_id, status, message, event_time
         FROM tracking_update WHERE order_id = ?
        ORDER BY event_time ASC`, [req.params.id]);

    res.json({ ...order, items, tracking });
  } catch (e) { next(e); }
});

// PATCH /api/orders/:id/status   { status, message }   -- seller only
r.patch('/:id/status', roleRequired('seller','admin'), async (req, res, next) => {
  try {
    const { status, message } = req.body;
    await pool.query('CALL sp_update_order_status(?,?,?)',
      [req.params.id, status, message || null]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default r;
