import { Router } from 'express';
import { query, callProc } from '../config/db.js';

const r = Router();

// GET /api/categories
r.get('/categories', async (_req, res, next) => {
  try {
    const rows = await query(
      `SELECT category_id AS id, name, icon, color FROM category ORDER BY category_id`);
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/shops?lat=&lon=
r.get('/shops', async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    let sql = `SELECT s.shop_id AS id, s.name, s.description, s.image_url AS image,
                      s.rating, s.review_count AS reviewCount, s.is_open AS isOpen,
                      s.delivery_fee AS deliveryFee, s.min_order_amount AS minOrderAmount,
                      s.phone,
                      DATE_FORMAT(s.open_time, '%h:%i %p')  AS openTimeStr,
                      DATE_FORMAT(s.close_time,'%h:%i %p') AS closeTimeStr,
                      l.latitude, l.longitude, l.address_line AS address,
                      l.city, l.state, l.zip_code AS zipCode `;
    const params = [];
    if (lat && lon) {
      sql += `, fn_distance_km(?, ?, l.latitude, l.longitude) AS distance `;
      params.push(Number(lat), Number(lon));
    }
    sql += ` FROM shop s JOIN location l ON l.location_id = s.location_id `;
    if (lat && lon) sql += ` ORDER BY distance ASC `;
    res.json(await query(sql, params));
  } catch (e) { next(e); }
});

// GET /api/shops/:id
r.get('/shops/:id', async (req, res, next) => {
  try {
    const [shop] = await query(
      `SELECT * FROM vw_shop_with_location WHERE shop_id = ?`, [req.params.id]);
    if (!shop) return res.status(404).json({ error: 'Not found' });
    const products = await query(
      `SELECT * FROM vw_listing_full WHERE shop_id = ?`, [req.params.id]);
    res.json({ shop, products });
  } catch (e) { next(e); }
});

// GET /api/products?q=&category=&shopId=
r.get('/products', async (req, res, next) => {
  try {
    const { q, category, shopId } = req.query;
    let sql = `SELECT * FROM vw_listing_full WHERE 1=1 `;
    const params = [];
    if (category && category !== 'all') {
      sql += ' AND category_name = ? ';
      params.push(category);
    }
    if (shopId) {
      sql += ' AND shop_id = ? ';
      params.push(shopId);
    }
    if (q) {
      sql += ` AND (product_name LIKE ? OR brand_name LIKE ?
                    OR product_description LIKE ?) `;
      const like = `%${q}%`;
      params.push(like, like, like);
    }
    sql += ' ORDER BY price ASC ';
    res.json(await query(sql, params));
  } catch (e) { next(e); }
});

// GET /api/products/:listingId        (single listing detail with images & features)
r.get('/products/:listingId', async (req, res, next) => {
  try {
    const [listing] = await query(
      `SELECT * FROM vw_listing_full WHERE listing_id = ?`, [req.params.listingId]);
    if (!listing) return res.status(404).json({ error: 'Not found' });

    const images = await query(
      `SELECT image_url FROM product_image WHERE product_id = ?`, [listing.product_id]);
    const features = await query(
      `SELECT feature_text FROM product_feature WHERE product_id = ?`, [listing.product_id]);
    res.json({
      ...listing,
      images:   images.map(i => i.image_url),
      features: features.map(f => f.feature_text),
    });
  } catch (e) { next(e); }
});

// GET /api/products/:productId/compare    (price comparison across shops)
r.get('/compare/:productId', async (req, res, next) => {
  try {
    const rows = await callProc('sp_compare_product_prices', [req.params.productId]);
    res.json(rows[0]);                // first result-set
  } catch (e) { next(e); }
});

export default r;
