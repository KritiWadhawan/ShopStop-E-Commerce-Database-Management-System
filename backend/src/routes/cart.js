import { Router } from 'express';
import { pool, query } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();
r.use(authRequired);

// GET /api/cart
r.get('/', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT ci.cart_item_id, ci.listing_id, ci.quantity,
              v.product_name, v.product_id, v.brand_name, v.category_name,
              v.default_image_url AS image, v.unit, v.price, v.original_price,
              v.shop_id, v.shop_name, v.delivery_time_text,
              v.delivery_fee, v.stock_count
         FROM cart c
         JOIN cart_item ci      ON ci.cart_id    = c.cart_id
         JOIN vw_listing_full v ON v.listing_id  = ci.listing_id
        WHERE c.user_id = ?`, [req.user.uid]);
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/cart  { listingId, quantity }
r.post('/', async (req, res, next) => {
  try {
    const { listingId, quantity = 1 } = req.body;
    await pool.query('CALL sp_add_to_cart(?,?,?)',
      [req.user.uid, listingId, quantity]);
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

// PATCH /api/cart/:listingId  { quantity }
r.patch('/:listingId', async (req, res, next) => {
  try {
    const q = Number(req.body.quantity);
    if (q <= 0) {
      await pool.query('CALL sp_remove_from_cart(?,?)',
        [req.user.uid, req.params.listingId]);
    } else {
      await query(
        `UPDATE cart_item ci
            JOIN cart c ON c.cart_id = ci.cart_id
              SET ci.quantity = ?
            WHERE c.user_id = ? AND ci.listing_id = ?`,
        [q, req.user.uid, req.params.listingId]);
    }
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// DELETE /api/cart/:listingId
r.delete('/:listingId', async (req, res, next) => {
  try {
    await pool.query('CALL sp_remove_from_cart(?,?)',
      [req.user.uid, req.params.listingId]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// DELETE /api/cart   (clear)
r.delete('/', async (req, res, next) => {
  try {
    await query(
      `DELETE ci FROM cart_item ci
         JOIN cart c ON c.cart_id = ci.cart_id
        WHERE c.user_id = ?`, [req.user.uid]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default r;
