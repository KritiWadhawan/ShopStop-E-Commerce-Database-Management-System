-- =====================================================================
--  EXAMPLE QUERIES  (assignment showcase)
--  Demonstrates joins, aggregates, nested sub-queries, correlated
--  sub-queries, set operators, window functions and view usage.
-- =====================================================================
USE shopstop;

-- ---------------------------------------------------------------------
-- A.  JOIN  +  AGGREGATE
--     Total revenue per shop on delivered orders.
-- ---------------------------------------------------------------------
SELECT  s.shop_id,
        s.name              AS shop_name,
        COUNT(o.order_id)   AS delivered_orders,
        IFNULL(SUM(o.total),0) AS revenue
  FROM shop s
  LEFT JOIN `order` o ON o.shop_id = s.shop_id AND o.status = 'delivered'
 GROUP BY s.shop_id, s.name
 ORDER BY revenue DESC;

-- ---------------------------------------------------------------------
-- B.  NESTED  (un-correlated) SUB-QUERY
--     Products whose lowest available price is greater than the
--     average lowest-price across the whole catalogue.
-- ---------------------------------------------------------------------
SELECT product_id, product_name, lowest_price
  FROM vw_lowest_price_per_product
 WHERE lowest_price > (SELECT AVG(lowest_price)
                         FROM vw_lowest_price_per_product);

-- ---------------------------------------------------------------------
-- C.  CORRELATED SUB-QUERY
--     For every shop, list its "best seller" — the listing that has
--     produced the most units sold.
-- ---------------------------------------------------------------------
SELECT s.shop_id, s.name AS shop_name,
       (SELECT p.name
          FROM order_item   oi
          JOIN shop_product sp ON sp.listing_id = oi.listing_id
          JOIN product      p  ON p.product_id  = sp.product_id
         WHERE sp.shop_id = s.shop_id
         GROUP BY p.product_id, p.name
         ORDER BY SUM(oi.quantity) DESC
         LIMIT 1)                                  AS best_seller
  FROM shop s;

-- ---------------------------------------------------------------------
-- D.  CORRELATED EXISTS
--     Buyers who have at least one un-delivered order.
-- ---------------------------------------------------------------------
SELECT u.user_id, u.name, u.email
  FROM user u
 WHERE u.role = 'buyer'
   AND EXISTS (SELECT 1 FROM `order` o
                WHERE o.user_id = u.user_id
                  AND o.status <> 'delivered'
                  AND o.status <> 'cancelled');

-- ---------------------------------------------------------------------
-- E.  PRODUCT COMPARISON  (the core feature)
--     For a given canonical product, list every shop selling it,
--     including computed distance from the buyer's home address.
-- ---------------------------------------------------------------------
SELECT  sp.listing_id, s.name AS shop_name, sp.price, sp.stock_count,
        sp.delivery_time_text,
        fn_distance_km(buyer_loc.latitude, buyer_loc.longitude,
                       shop_loc.latitude,  shop_loc.longitude) AS distance_km
  FROM shop_product sp
  JOIN shop     s        ON s.shop_id        = sp.shop_id
  JOIN location shop_loc ON shop_loc.location_id = s.location_id
  JOIN address  a        ON a.user_id  = 1   AND a.is_default = TRUE
  JOIN location buyer_loc ON buyer_loc.location_id = a.location_id
 WHERE sp.product_id = 1
   AND sp.stock_count > 0
 ORDER BY sp.price ASC, distance_km ASC;

-- ---------------------------------------------------------------------
-- F.  WINDOW FUNCTION  (rank shops by revenue within their city)
-- ---------------------------------------------------------------------
SELECT shop_name, city, revenue,
       RANK() OVER (PARTITION BY city ORDER BY revenue DESC) AS city_rank
  FROM (
    SELECT s.name AS shop_name, l.city,
           IFNULL(SUM(o.total),0) AS revenue
      FROM shop s
      JOIN location l    ON l.location_id = s.location_id
      LEFT JOIN `order` o ON o.shop_id = s.shop_id AND o.status = 'delivered'
     GROUP BY s.shop_id, s.name, l.city
  ) t;

-- ---------------------------------------------------------------------
-- G.  USE OF A FUNCTION  +  AGGREGATE
-- ---------------------------------------------------------------------
SELECT u.name,
       fn_user_total_spend(u.user_id) AS lifetime_value
  FROM user u WHERE u.role = 'buyer'
 ORDER BY lifetime_value DESC;

-- ---------------------------------------------------------------------
-- H.  SET OPERATOR (UNION) - users that are either active buyers
--     OR active sellers (have at least one listing/order this week).
-- ---------------------------------------------------------------------
SELECT u.user_id, u.name, 'buyer' AS activity
  FROM user u
 WHERE EXISTS (SELECT 1 FROM `order` o
                WHERE o.user_id = u.user_id
                  AND o.created_at >= NOW() - INTERVAL 7 DAY)
UNION
SELECT u.user_id, u.name, 'seller'
  FROM user u
  JOIN shop s ON s.seller_user_id = u.user_id
 WHERE EXISTS (SELECT 1 FROM `order` o
                WHERE o.shop_id = s.shop_id
                  AND o.created_at >= NOW() - INTERVAL 7 DAY);

-- ---------------------------------------------------------------------
-- I.  CALL A PROCEDURE
-- ---------------------------------------------------------------------
CALL sp_compare_product_prices(1);          -- iPhone 15 Pro Max
CALL sp_seller_dashboard(2);                -- Seller "Amit Patel"
