-- =====================================================================
--  VIEWS  (read helpers used by the API and the queries.sql examples)
-- =====================================================================
USE shopstop;

DROP VIEW IF EXISTS vw_listing_full;
DROP VIEW IF EXISTS vw_lowest_price_per_product;
DROP VIEW IF EXISTS vw_shop_with_location;
DROP VIEW IF EXISTS vw_order_summary;

-- A "fat" listing view: everything the product cards need.
CREATE VIEW vw_listing_full AS
SELECT  sp.listing_id,
        sp.product_id,
        sp.shop_id,
        p.name           AS product_name,
        p.description    AS product_description,
        p.unit,
        p.default_image_url,
        b.name           AS brand_name,
        c.name           AS category_name,
        s.name           AS shop_name,
        s.image_url      AS shop_image,
        s.rating         AS shop_rating,
        s.delivery_fee,
        sp.price,
        sp.original_price,
        sp.stock_count,
        sp.in_stock,
        sp.delivery_time_text,
        sp.listing_rating,
        sp.listing_review_count,
        l.latitude       AS shop_lat,
        l.longitude      AS shop_lon,
        l.address_line   AS shop_address
  FROM shop_product sp
  JOIN product  p ON p.product_id  = sp.product_id
  JOIN shop     s ON s.shop_id     = sp.shop_id
  JOIN location l ON l.location_id = s.location_id
  LEFT JOIN brand    b ON b.brand_id    = p.brand_id
  LEFT JOIN category c ON c.category_id = p.category_id;

-- One row per canonical product showing its cheapest in-stock listing.
CREATE VIEW vw_lowest_price_per_product AS
SELECT  p.product_id,
        p.name              AS product_name,
        MIN(sp.price)       AS lowest_price,
        COUNT(*)            AS shop_count
  FROM product p
  JOIN shop_product sp ON sp.product_id = p.product_id
 WHERE sp.stock_count > 0
 GROUP BY p.product_id, p.name;

-- Convenience: shop with its full location flattened.
CREATE VIEW vw_shop_with_location AS
SELECT s.*, l.latitude, l.longitude, l.address_line, l.city, l.state, l.zip_code
  FROM shop s JOIN location l ON l.location_id = s.location_id;

-- Order header with computed counts.
CREATE VIEW vw_order_summary AS
SELECT o.order_id, o.user_id, u.name AS user_name,
       o.shop_id,  s.name AS shop_name,
       o.status,   o.subtotal, o.delivery_fee, o.total,
       o.created_at, o.estimated_delivery_time, o.actual_delivery_time,
       (SELECT COUNT(*) FROM order_item oi WHERE oi.order_id = o.order_id) AS line_count,
       (SELECT SUM(quantity) FROM order_item oi WHERE oi.order_id = o.order_id) AS units
  FROM `order` o
  JOIN user u ON u.user_id = o.user_id
  JOIN shop s ON s.shop_id = o.shop_id;
