import { Router } from 'express';
import { query } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();
r.use(authRequired);

// GET /api/compare        -> products in the buyer's compare list
r.get('/', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT p.product_id AS id, p.name, p.description, p.unit,
              p.default_image_url AS image, b.name AS brand,
              c.name AS category,
              fn_lowest_price_for_product(p.product_id) AS lowest_price
         FROM compare_list cl
         JOIN compare_item ci ON ci.compare_id = cl.compare_id
         JOIN product p ON p.product_id = ci.product_id
         LEFT JOIN brand b    ON b.brand_id    = p.brand_id
         LEFT JOIN category c ON c.category_id = p.category_id
        WHERE cl.user_id = ?`, [req.user.uid]);
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/compare  { productId }
r.post('/', async (req, res, next) => {
  try {
    const { productId } = req.body;
    await query(
      `INSERT INTO compare_item (compare_id, product_id)
        SELECT cl.compare_id, ?
          FROM compare_list cl WHERE cl.user_id = ?`,
      [productId, req.user.uid]);
    res.status(201).json({ ok: true });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.json({ ok: true });
    if (e.sqlState === '45000')
      return res.status(400).json({ error: e.sqlMessage });
    next(e);
  }
});

// DELETE /api/compare/:productId
r.delete('/:productId', async (req, res, next) => {
  try {
    await query(
      `DELETE ci FROM compare_item ci
         JOIN compare_list cl ON cl.compare_id = ci.compare_id
        WHERE cl.user_id = ? AND ci.product_id = ?`,
      [req.user.uid, req.params.productId]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// DELETE /api/compare       (clear)
r.delete('/', async (req, res, next) => {
  try {
    await query(
      `DELETE ci FROM compare_item ci
         JOIN compare_list cl ON cl.compare_id = ci.compare_id
        WHERE cl.user_id = ?`, [req.user.uid]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default r;
