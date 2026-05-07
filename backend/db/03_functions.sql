-- =====================================================================
--  USER-DEFINED FUNCTIONS
-- =====================================================================
USE shopstop;

DROP FUNCTION IF EXISTS fn_distance_km;
DROP FUNCTION IF EXISTS fn_listing_avg_rating;
DROP FUNCTION IF EXISTS fn_user_total_spend;
DROP FUNCTION IF EXISTS fn_lowest_price_for_product;
DROP FUNCTION IF EXISTS fn_order_grand_total;

DELIMITER $$
-- ---------------------------------------------------------------------
-- 1. Haversine distance in kilometres between two (lat,lon) points.
--    Used to sort shops by proximity to the buyer.
-- ---------------------------------------------------------------------
CREATE FUNCTION fn_distance_km(
    lat1 DECIMAL(10,7), lon1 DECIMAL(10,7),
    lat2 DECIMAL(10,7), lon2 DECIMAL(10,7)
) RETURNS DECIMAL(8,3)
DETERMINISTIC
BEGIN
    DECLARE r       DECIMAL(8,3) DEFAULT 6371.0;       -- Earth radius
    DECLARE dlat    DECIMAL(12,8);
    DECLARE dlon    DECIMAL(12,8);
    DECLARE a       DECIMAL(20,15);
    DECLARE c       DECIMAL(20,15);
    SET dlat = RADIANS(lat2 - lat1);
    SET dlon = RADIANS(lon2 - lon1);
    SET a = SIN(dlat/2)*SIN(dlat/2) +
            COS(RADIANS(lat1))*COS(RADIANS(lat2))*SIN(dlon/2)*SIN(dlon/2);
    SET c = 2 * ATAN2(SQRT(a), SQRT(1-a));
    RETURN ROUND(r * c, 3);
END$$

-- ---------------------------------------------------------------------
-- 2. Average rating of a particular listing (computed live from review).
-- ---------------------------------------------------------------------
CREATE FUNCTION fn_listing_avg_rating(p_listing_id INT)
RETURNS DECIMAL(3,2)
READS SQL DATA
BEGIN
    DECLARE v_avg DECIMAL(3,2);
    SELECT IFNULL(AVG(rating),0) INTO v_avg
      FROM review WHERE listing_id = p_listing_id;
    RETURN v_avg;
END$$

-- ---------------------------------------------------------------------
-- 3. Total amount a user has ever spent on delivered orders.
-- ---------------------------------------------------------------------
CREATE FUNCTION fn_user_total_spend(p_user_id INT)
RETURNS DECIMAL(12,2)
READS SQL DATA
BEGIN
    DECLARE v_total DECIMAL(12,2);
    SELECT IFNULL(SUM(total),0) INTO v_total
      FROM `order`
     WHERE user_id = p_user_id AND status = 'delivered';
    RETURN v_total;
END$$

-- ---------------------------------------------------------------------
-- 4. Lowest available price for a canonical product across all shops.
--    Returns NULL when no shop currently lists it in stock.
-- ---------------------------------------------------------------------
CREATE FUNCTION fn_lowest_price_for_product(p_product_id INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
    DECLARE v_min DECIMAL(10,2);
    SELECT MIN(price) INTO v_min
      FROM shop_product
     WHERE product_id = p_product_id AND stock_count > 0;
    RETURN v_min;
END$$

-- ---------------------------------------------------------------------
-- 5. Order grand-total recalculated from order_item lines.
-- ---------------------------------------------------------------------
CREATE FUNCTION fn_order_grand_total(p_order_id INT)
RETURNS DECIMAL(12,2)
READS SQL DATA
BEGIN
    DECLARE v_sub  DECIMAL(12,2);
    DECLARE v_fee  DECIMAL(10,2);
    SELECT IFNULL(SUM(quantity*unit_price),0) INTO v_sub
      FROM order_item WHERE order_id = p_order_id;
    SELECT delivery_fee INTO v_fee
      FROM `order` WHERE order_id = p_order_id;
    RETURN v_sub + IFNULL(v_fee,0);
END$$

DELIMITER ;
