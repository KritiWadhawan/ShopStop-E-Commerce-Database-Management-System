-- =====================================================================
--  ShopStop  -  RELATIONAL SCHEMA  (MySQL 8.x)
--  20 tables in 3NF / BCNF.  Run order:
--      01_schema.sql   <- this file
--      02_seed.sql
--      03_functions.sql
--      04_procedures.sql
--      05_triggers.sql
--      06_views.sql        (optional)
-- =====================================================================

DROP DATABASE IF EXISTS shopstop;
CREATE DATABASE shopstop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopstop;

-- ---------------------------------------------------------------------
-- 1.  USER
-- ---------------------------------------------------------------------
CREATE TABLE user (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(120) NOT NULL,
    email          VARCHAR(160) NOT NULL UNIQUE,
    phone          VARCHAR(25)  NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    role           ENUM('buyer','seller','admin') NOT NULL DEFAULT 'buyer',
    avatar_url     VARCHAR(500),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2.  LOCATION  (reused by address, shop, tracking_update, ...)
-- ---------------------------------------------------------------------
CREATE TABLE location (
    location_id    INT AUTO_INCREMENT PRIMARY KEY,
    latitude       DECIMAL(10,7) NOT NULL,
    longitude      DECIMAL(10,7) NOT NULL,
    address_line   VARCHAR(255),
    city           VARCHAR(80),
    state          VARCHAR(80),
    zip_code       VARCHAR(15),
    INDEX idx_loc_geo (latitude, longitude)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3.  ADDRESS  (a buyer's saved address)
-- ---------------------------------------------------------------------
CREATE TABLE address (
    address_id     INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    label          VARCHAR(40) NOT NULL,
    location_id    INT NOT NULL,
    is_default     BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id)     REFERENCES user(user_id)         ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES location(location_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4.  CATEGORY
-- ---------------------------------------------------------------------
CREATE TABLE category (
    category_id    INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(80) NOT NULL UNIQUE,
    icon           VARCHAR(20),
    color          VARCHAR(60)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5.  BRAND
-- ---------------------------------------------------------------------
CREATE TABLE brand (
    brand_id       INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6.  SHOP
-- ---------------------------------------------------------------------
CREATE TABLE shop (
    shop_id            INT AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(120) NOT NULL,
    description        TEXT,
    image_url          VARCHAR(500),
    location_id        INT NOT NULL,
    rating             DECIMAL(3,2) DEFAULT 0,
    review_count       INT          DEFAULT 0,
    is_open            BOOLEAN      DEFAULT TRUE,
    open_time          TIME,
    close_time         TIME,
    delivery_fee       DECIMAL(10,2) DEFAULT 0,
    min_order_amount   DECIMAL(10,2) DEFAULT 0,
    phone              VARCHAR(25),
    seller_user_id     INT NOT NULL,
    FOREIGN KEY (location_id)    REFERENCES location(location_id) ON DELETE RESTRICT,
    FOREIGN KEY (seller_user_id) REFERENCES user(user_id)         ON DELETE CASCADE,
    UNIQUE (seller_user_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7.  SHOP_CATEGORY  (M:N)
-- ---------------------------------------------------------------------
CREATE TABLE shop_category (
    shop_id        INT NOT NULL,
    category_id    INT NOT NULL,
    PRIMARY KEY (shop_id, category_id),
    FOREIGN KEY (shop_id)     REFERENCES shop(shop_id)         ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8.  PRODUCT  (the canonical product, NOT the listing)
-- ---------------------------------------------------------------------
CREATE TABLE product (
    product_id        INT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(200) NOT NULL,
    description       TEXT,
    brand_id          INT,
    category_id       INT NOT NULL,
    default_image_url VARCHAR(500),
    unit              VARCHAR(60),
    FOREIGN KEY (brand_id)    REFERENCES brand(brand_id)       ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE RESTRICT,
    INDEX idx_product_name (name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9.  PRODUCT_IMAGE
-- ---------------------------------------------------------------------
CREATE TABLE product_image (
    image_id       INT AUTO_INCREMENT PRIMARY KEY,
    product_id     INT NOT NULL,
    image_url      VARCHAR(500) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. PRODUCT_FEATURE
-- ---------------------------------------------------------------------
CREATE TABLE product_feature (
    feature_id     INT AUTO_INCREMENT PRIMARY KEY,
    product_id     INT NOT NULL,
    feature_text   VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. SHOP_PRODUCT  (the LISTING - same product, many shops)
--      This relation supports the price-comparison feature.
-- ---------------------------------------------------------------------
CREATE TABLE shop_product (
    listing_id            INT AUTO_INCREMENT PRIMARY KEY,
    shop_id               INT NOT NULL,
    product_id            INT NOT NULL,
    price                 DECIMAL(10,2) NOT NULL,
    original_price        DECIMAL(10,2),
    stock_count           INT NOT NULL DEFAULT 0,
    in_stock              BOOLEAN GENERATED ALWAYS AS (stock_count > 0) STORED,
    delivery_time_text    VARCHAR(40),
    listing_rating        DECIMAL(3,2) DEFAULT 0,
    listing_review_count  INT          DEFAULT 0,
    UNIQUE (shop_id, product_id),
    FOREIGN KEY (shop_id)    REFERENCES shop(shop_id)       ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    CHECK (price >= 0 AND stock_count >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 12. CART  (one per buyer)
-- ---------------------------------------------------------------------
CREATE TABLE cart (
    cart_id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL UNIQUE,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 13. CART_ITEM
-- ---------------------------------------------------------------------
CREATE TABLE cart_item (
    cart_item_id   INT AUTO_INCREMENT PRIMARY KEY,
    cart_id        INT NOT NULL,
    listing_id     INT NOT NULL,
    quantity       INT NOT NULL DEFAULT 1,
    added_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cart_id, listing_id),
    FOREIGN KEY (cart_id)    REFERENCES cart(cart_id)            ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES shop_product(listing_id) ON DELETE CASCADE,
    CHECK (quantity > 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 14. COMPARE_LIST + COMPARE_ITEM  (buyer's "compare these products" basket)
-- ---------------------------------------------------------------------
CREATE TABLE compare_list (
    compare_id     INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE compare_item (
    compare_item_id INT AUTO_INCREMENT PRIMARY KEY,
    compare_id      INT NOT NULL,
    product_id      INT NOT NULL,
    UNIQUE (compare_id, product_id),
    FOREIGN KEY (compare_id) REFERENCES compare_list(compare_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id)      ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 15. DELIVERY_PERSON
-- ---------------------------------------------------------------------
CREATE TABLE delivery_person (
    delivery_person_id   INT AUTO_INCREMENT PRIMARY KEY,
    name                 VARCHAR(120) NOT NULL,
    phone                VARCHAR(25),
    rating               DECIMAL(3,2) DEFAULT 0,
    vehicle              VARCHAR(60),
    current_location_id  INT,
    FOREIGN KEY (current_location_id) REFERENCES location(location_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 16. ORDER  (back-ticked because ORDER is reserved)
-- ---------------------------------------------------------------------
CREATE TABLE `order` (
    order_id                  INT AUTO_INCREMENT PRIMARY KEY,
    user_id                   INT NOT NULL,
    shop_id                   INT NOT NULL,
    subtotal                  DECIMAL(10,2) NOT NULL DEFAULT 0,
    delivery_fee              DECIMAL(10,2) NOT NULL DEFAULT 0,
    total                     DECIMAL(10,2) NOT NULL DEFAULT 0,
    status                    ENUM('placed','confirmed','preparing',
                                   'out_for_delivery','delivered','cancelled')
                              NOT NULL DEFAULT 'placed',
    delivery_address_id       INT NOT NULL,
    estimated_delivery_time   VARCHAR(40),
    actual_delivery_time      DATETIME,
    delivery_person_id        INT,
    created_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)             REFERENCES user(user_id)              ON DELETE RESTRICT,
    FOREIGN KEY (shop_id)             REFERENCES shop(shop_id)              ON DELETE RESTRICT,
    FOREIGN KEY (delivery_address_id) REFERENCES address(address_id)        ON DELETE RESTRICT,
    FOREIGN KEY (delivery_person_id)  REFERENCES delivery_person(delivery_person_id)
                                                                          ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 17. ORDER_ITEM
-- ---------------------------------------------------------------------
CREATE TABLE order_item (
    order_item_id  INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT NOT NULL,
    listing_id     INT NOT NULL,
    quantity       INT NOT NULL,
    unit_price     DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES `order`(order_id)         ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES shop_product(listing_id)  ON DELETE RESTRICT,
    CHECK (quantity > 0 AND unit_price >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 18. TRACKING_UPDATE
-- ---------------------------------------------------------------------
CREATE TABLE tracking_update (
    update_id      INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT NOT NULL,
    status         ENUM('placed','confirmed','preparing',
                        'out_for_delivery','delivered','cancelled') NOT NULL,
    message        VARCHAR(255),
    location_id    INT,
    event_time     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id)    REFERENCES `order`(order_id)     ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES location(location_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 19. REVIEW  (buyer reviews a particular listing)
-- ---------------------------------------------------------------------
CREATE TABLE review (
    review_id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    listing_id     INT NOT NULL,
    rating         TINYINT NOT NULL,
    comment        TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, listing_id),
    FOREIGN KEY (user_id)    REFERENCES user(user_id)            ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES shop_product(listing_id) ON DELETE CASCADE,
    CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
--  USEFUL INDEXES
-- ---------------------------------------------------------------------
CREATE INDEX idx_listing_price        ON shop_product (product_id, price);
CREATE INDEX idx_order_user_status    ON `order`      (user_id, status);
CREATE INDEX idx_order_shop_status    ON `order`      (shop_id, status);
CREATE INDEX idx_review_listing       ON review       (listing_id);
