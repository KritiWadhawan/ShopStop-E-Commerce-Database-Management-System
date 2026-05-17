-- =====================================================================
--  TRIGGERS
--  These keep the database self-consistent without the application
--  having to remember to do book-keeping.
-- =====================================================================
USE shopstop;

DROP TRIGGER IF EXISTS trg_after_user_insert;
DROP TRIGGER IF EXISTS trg_before_orderitem_insert;
DROP TRIGGER IF EXISTS trg_after_order_insert;
DROP TRIGGER IF EXISTS trg_after_order_status_update;
DROP TRIGGER IF EXISTS trg_after_review_insert;
DROP TRIGGER IF EXISTS trg_after_review_delete;
DROP TRIGGER IF EXISTS trg_max_compare_items;

DELIMITER $$

-- ---------------------------------------------------------------------
-- 1. Whenever a new BUYER row is created, give them an empty cart and
--    an empty compare-list automatically.
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_after_user_insert
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.role = 'buyer' THEN
        INSERT INTO cart         (user_id) VALUES (NEW.user_id);
        INSERT INTO compare_list (user_id) VALUES (NEW.user_id);
    END IF;
END$$

-- ---------------------------------------------------------------------
-- (Stock validation + decrement is now handled inside sp_place_order
--  itself, because MySQL forbids a trigger from updating the same table
--  that the statement which invoked the trigger is reading.  See the
--  comment in 04_procedures.sql > sp_place_order for details.)
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- 3. After an order is created, write the first 'placed' tracking row.
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_after_order_insert
AFTER INSERT ON `order`
FOR EACH ROW
BEGIN
    INSERT INTO tracking_update (order_id, status, message)
    VALUES (NEW.order_id, 'placed', 'Order placed successfully');
END$$

-- ---------------------------------------------------------------------
-- 4. Whenever order.status changes, log a tracking_update automatically.
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_after_order_status_update
AFTER UPDATE ON `order`
FOR EACH ROW
BEGIN
    IF NEW.status <> OLD.status THEN
        INSERT INTO tracking_update (order_id, status, message)
        VALUES (NEW.order_id, NEW.status,
                CONCAT('Status changed to ', NEW.status));
    END IF;
END$$

-- ---------------------------------------------------------------------
-- 5. After a review is INSERTED or DELETED, refresh the cached
--    listing_rating / listing_review_count on shop_product
--    AND the parent shop's rating / review_count.
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_after_review_insert
AFTER INSERT ON review
FOR EACH ROW
BEGIN
    DECLARE v_shop INT;

    UPDATE shop_product
       SET listing_review_count = listing_review_count + 1,
           listing_rating       = (SELECT AVG(rating) FROM review
                                    WHERE listing_id = NEW.listing_id)
     WHERE listing_id = NEW.listing_id;

    SELECT shop_id INTO v_shop FROM shop_product WHERE listing_id = NEW.listing_id;

    UPDATE shop
       SET review_count = review_count + 1,
           rating       = (SELECT AVG(r.rating)
                             FROM review r
                             JOIN shop_product sp ON sp.listing_id = r.listing_id
                            WHERE sp.shop_id = v_shop)
     WHERE shop_id = v_shop;
END$$

CREATE TRIGGER trg_after_review_delete
AFTER DELETE ON review
FOR EACH ROW
BEGIN
    DECLARE v_shop INT;

    UPDATE shop_product
       SET listing_review_count = GREATEST(listing_review_count - 1, 0),
           listing_rating       = IFNULL((SELECT AVG(rating) FROM review
                                          WHERE listing_id = OLD.listing_id),0)
     WHERE listing_id = OLD.listing_id;

    SELECT shop_id INTO v_shop FROM shop_product WHERE listing_id = OLD.listing_id;

    UPDATE shop
       SET review_count = GREATEST(review_count - 1, 0),
           rating       = IFNULL((SELECT AVG(r.rating)
                                    FROM review r
                                    JOIN shop_product sp ON sp.listing_id = r.listing_id
                                   WHERE sp.shop_id = v_shop),0)
     WHERE shop_id = v_shop;
END$$

-- ---------------------------------------------------------------------
-- 6. Limit the comparison list to a maximum of 4 products
--    (matches the front-end ProductComparison rule).
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_max_compare_items
BEFORE INSERT ON compare_item
FOR EACH ROW
BEGIN
    DECLARE v_count INT;
    SELECT COUNT(*) INTO v_count
      FROM compare_item WHERE compare_id = NEW.compare_id;
    IF v_count >= 4 THEN
        SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = 'You can compare at most 4 products at a time';
    END IF;
END$$

DELIMITER ;
