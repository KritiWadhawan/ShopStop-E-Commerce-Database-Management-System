-- =====================================================================
--  STORED PROCEDURES
--  Encapsulate business operations that touch many tables atomically.
-- =====================================================================
USE shopstop;

DROP PROCEDURE IF EXISTS sp_register_user;
DROP PROCEDURE IF EXISTS sp_add_to_cart;
DROP PROCEDURE IF EXISTS sp_remove_from_cart;
DROP PROCEDURE IF EXISTS sp_place_order;
DROP PROCEDURE IF EXISTS sp_update_order_status;
DROP PROCEDURE IF EXISTS sp_seller_dashboard;
DROP PROCEDURE IF EXISTS sp_compare_product_prices;

DELIMITER $$

-- ---------------------------------------------------------------------
-- 1. Register a buyer or seller.  Creates a cart and a compare list
--    automatically for buyers.
-- ---------------------------------------------------------------------
CREATE PROCEDURE sp_register_user(
    IN  p_name          VARCHAR(120),
    IN  p_email         VARCHAR(160),
    IN  p_phone         VARCHAR(25),
    IN  p_password_hash VARCHAR(255),
    IN  p_role          VARCHAR(10),
    OUT p_user_id       INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;
        INSERT INTO user (name, email, phone, password_hash, role)
        VALUES (p_name, p_email, p_phone, p_password_hash, p_role);
        SET p_user_id = LAST_INSERT_ID();

        IF p_role = 'buyer' THEN
            INSERT INTO cart         (user_id) VALUES (p_user_id);
            INSERT INTO compare_list (user_id) VALUES (p_user_id);
        END IF;
    COMMIT;
END$$

-- ---------------------------------------------------------------------
-- 2. Add (or increment) an item in the user's cart.
--    Refuses if listing is out of stock.
-- ---------------------------------------------------------------------
CREATE PROCEDURE sp_add_to_cart(
    IN p_user_id    INT,
    IN p_listing_id INT,
    IN p_quantity   INT
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_stock   INT;

    SELECT cart_id INTO v_cart_id FROM cart WHERE user_id = p_user_id;
    IF v_cart_id IS NULL THEN
        INSERT INTO cart (user_id) VALUES (p_user_id);
        SET v_cart_id = LAST_INSERT_ID();
    END IF;

    SELECT stock_count INTO v_stock FROM shop_product WHERE listing_id = p_listing_id;
    IF v_stock IS NULL OR v_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'Insufficient stock for this listing';
    END IF;

    INSERT INTO cart_item (cart_id, listing_id, quantity)
        VALUES (v_cart_id, p_listing_id, p_quantity)
    ON DUPLICATE KEY UPDATE
        quantity = quantity + VALUES(quantity);
END$$

-- ---------------------------------------------------------------------
-- 3. Remove a line completely.
-- ---------------------------------------------------------------------
CREATE PROCEDURE sp_remove_from_cart(
    IN p_user_id    INT,
    IN p_listing_id INT
)
BEGIN
    DELETE ci FROM cart_item ci
      JOIN cart c ON c.cart_id = ci.cart_id
     WHERE c.user_id = p_user_id AND ci.listing_id = p_listing_id;
END$$

-- ---------------------------------------------------------------------
-- 4. Place an order from a single shop.  Atomically:
--    a) creates the `order` row,
--    b) copies the user's cart-items belonging to that shop into
--       order_item using the listing's CURRENT price,
--    c) deletes those cart_item rows,
--    d) the BEFORE-INSERT trigger on order_item decrements stock,
--    e) the AFTER-INSERT trigger on `order` writes the first
--       tracking_update.
-- ---------------------------------------------------------------------
CREATE PROCEDURE sp_place_order(
    IN  p_user_id    INT,
    IN  p_shop_id    INT,
    IN  p_address_id INT,
    OUT p_order_id   INT
)
BEGIN
    DECLARE v_subtotal     DECIMAL(12,2) DEFAULT 0;
    DECLARE v_delivery_fee DECIMAL(10,2);
    DECLARE v_eta          VARCHAR(40);
    DECLARE v_insufficient INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        DROP TEMPORARY TABLE IF EXISTS tmp_order_lines;
        RESIGNAL;
    END;

    START TRANSACTION;
        SELECT delivery_fee, '20-40 min'
               INTO v_delivery_fee, v_eta
          FROM shop WHERE shop_id = p_shop_id;

        -- stock validation BEFORE any writes
        SELECT COUNT(*) INTO v_insufficient
          FROM cart c
          JOIN cart_item    ci ON ci.cart_id    = c.cart_id
          JOIN shop_product sp ON sp.listing_id = ci.listing_id
         WHERE c.user_id = p_user_id
           AND sp.shop_id = p_shop_id
           AND sp.stock_count < ci.quantity;
        IF v_insufficient > 0 THEN
            SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = 'Insufficient stock for one or more items';
        END IF;

        -- compute subtotal from cart items belonging to that shop
        SELECT IFNULL(SUM(sp.price * ci.quantity),0)
          INTO v_subtotal
          FROM cart c
          JOIN cart_item    ci ON ci.cart_id    = c.cart_id
          JOIN shop_product sp ON sp.listing_id = ci.listing_id
         WHERE c.user_id = p_user_id AND sp.shop_id = p_shop_id;

        IF v_subtotal = 0 THEN
            SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = 'No items from that shop in cart';
        END IF;

        -- stage cart lines in a TEMP table so the INSERT into order_item
        -- below does NOT reference shop_product directly.  This avoids
        -- MySQL's "Can't update table 'shop_product' in stored function/
        -- trigger because it is already used by statement which invoked
        -- this stored function/trigger" error.
        DROP TEMPORARY TABLE IF EXISTS tmp_order_lines;
        CREATE TEMPORARY TABLE tmp_order_lines (
            listing_id INT,
            quantity   INT,
            unit_price DECIMAL(10,2)
        );
        INSERT INTO tmp_order_lines (listing_id, quantity, unit_price)
        SELECT sp.listing_id, ci.quantity, sp.price
          FROM cart c
          JOIN cart_item    ci ON ci.cart_id    = c.cart_id
          JOIN shop_product sp ON sp.listing_id = ci.listing_id
         WHERE c.user_id = p_user_id AND sp.shop_id = p_shop_id;

        -- decrement stock directly here (the BEFORE-INSERT trigger has
        -- been removed because of the recursive-table-access limitation)
        UPDATE shop_product sp
          JOIN tmp_order_lines t ON t.listing_id = sp.listing_id
           SET sp.stock_count = sp.stock_count - t.quantity;

        -- create the order row (AFTER-INSERT trigger writes first tracking row)
        INSERT INTO `order` (user_id, shop_id, subtotal, delivery_fee, total,
                             status, delivery_address_id, estimated_delivery_time)
        VALUES (p_user_id, p_shop_id, v_subtotal, v_delivery_fee,
                v_subtotal + v_delivery_fee, 'placed', p_address_id, v_eta);
        SET p_order_id = LAST_INSERT_ID();

        -- copy lines from the temp table (no shop_product reference here)
        INSERT INTO order_item (order_id, listing_id, quantity, unit_price)
        SELECT p_order_id, listing_id, quantity, unit_price FROM tmp_order_lines;

        -- empty those lines from the cart
        DELETE ci FROM cart_item ci
          JOIN cart c          ON c.cart_id     = ci.cart_id
          JOIN shop_product sp ON sp.listing_id = ci.listing_id
         WHERE c.user_id = p_user_id AND sp.shop_id = p_shop_id;

        DROP TEMPORARY TABLE IF EXISTS tmp_order_lines;
    COMMIT;
END$$

-- ---------------------------------------------------------------------
-- 5. Move an order through its lifecycle.
-- ---------------------------------------------------------------------
CREATE PROCEDURE sp_update_order_status(
    IN p_order_id INT,
    IN p_status   VARCHAR(20),
    IN p_message  VARCHAR(255)
)
BEGIN
    UPDATE `order`
       SET status = p_status,
           actual_delivery_time = CASE WHEN p_status = 'delivered'
                                       THEN NOW() ELSE actual_delivery_time END
     WHERE order_id = p_order_id;
    -- The trigger trg_after_order_status_update inserts the tracking row.
END$$

-- ---------------------------------------------------------------------
-- 6. Seller dashboard summary in a single round-trip.
-- ---------------------------------------------------------------------
CREATE PROCEDURE sp_seller_dashboard(IN p_seller_user_id INT)
BEGIN
    DECLARE v_shop_id INT;
    SELECT shop_id INTO v_shop_id FROM shop WHERE seller_user_id = p_seller_user_id;

    -- KPIs
    SELECT
        v_shop_id                                                   AS shop_id,
        (SELECT name FROM shop WHERE shop_id = v_shop_id)           AS shop_name,
        (SELECT COUNT(*) FROM `order` WHERE shop_id = v_shop_id)    AS total_orders,
        (SELECT IFNULL(SUM(total),0) FROM `order`
              WHERE shop_id = v_shop_id AND status = 'delivered')   AS total_revenue,
        (SELECT COUNT(*) FROM `order`
              WHERE shop_id = v_shop_id
                AND status IN ('placed','confirmed','preparing','out_for_delivery')) AS pending_orders,
        (SELECT COUNT(*) FROM shop_product WHERE shop_id = v_shop_id)               AS active_listings;

    -- Top 5 products by units sold
    SELECT p.product_id, p.name, SUM(oi.quantity) AS units_sold,
           SUM(oi.quantity*oi.unit_price) AS revenue
      FROM `order` o
      JOIN order_item   oi ON oi.order_id   = o.order_id
      JOIN shop_product sp ON sp.listing_id = oi.listing_id
      JOIN product      p  ON p.product_id  = sp.product_id
     WHERE o.shop_id = v_shop_id AND o.status = 'delivered'
     GROUP BY p.product_id, p.name
     ORDER BY units_sold DESC
     LIMIT 5;
END$$

-- ---------------------------------------------------------------------
-- 7. Compare a canonical product across every shop that lists it,
--    sorted by the cheapest price first.  Powers the comparison page.
-- ---------------------------------------------------------------------
CREATE PROCEDURE sp_compare_product_prices(IN p_product_id INT)
BEGIN
    SELECT sp.listing_id, sp.shop_id, s.name AS shop_name, s.rating AS shop_rating,
           sp.price, sp.original_price, sp.stock_count, sp.delivery_time_text,
           l.address_line, l.city
      FROM shop_product sp
      JOIN shop s     ON s.shop_id     = sp.shop_id
      JOIN location l ON l.location_id = s.location_id
     WHERE sp.product_id = p_product_id AND sp.stock_count > 0
     ORDER BY sp.price ASC, s.rating DESC;
END$$

DELIMITER ;
