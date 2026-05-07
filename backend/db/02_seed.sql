-- =====================================================================
--  SEED DATA  (mirrors src/app/data/mockData.ts)
--  Default password for every seeded user is:  password123
--  bcrypt hash below is for "password123" with cost 10.
-- =====================================================================
USE shopstop;

-- ----------- USERS ---------------------------------------------------
-- buyer_id 1: Rahul ; sellers 2..7
INSERT INTO user (user_id, name, email, phone, password_hash, role, avatar_url) VALUES
(1,'Rahul Sharma','rahul@example.com','+91 98765 43200',
 '$2b$10$7v3SAMPLEbcryptHASHforpassword123abcdefghijklmnopqrstuv','buyer',
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'),
(2,'Amit Patel','amit@example.com','+91 98765 43201',
 '$2b$10$7v3SAMPLEbcryptHASHforpassword123abcdefghijklmnopqrstuv','seller',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),
(3,'Priya Singh','priya@example.com','+91 98765 43202',
 '$2b$10$7v3SAMPLEbcryptHASHforpassword123abcdefghijklmnopqrstuv','seller', NULL),
(4,'Suresh Kumar','suresh@example.com','+91 98765 43203',
 '$2b$10$7v3SAMPLEbcryptHASHforpassword123abcdefghijklmnopqrstuv','seller', NULL),
(5,'Meena Devi','meena@example.com','+91 98765 43204',
 '$2b$10$7v3SAMPLEbcryptHASHforpassword123abcdefghijklmnopqrstuv','seller', NULL),
(6,'Raj Malhotra','raj@example.com','+91 98765 43205',
 '$2b$10$7v3SAMPLEbcryptHASHforpassword123abcdefghijklmnopqrstuv','seller', NULL),
(7,'Deepak Joshi','deepak@example.com','+91 98765 43206',
 '$2b$10$7v3SAMPLEbcryptHASHforpassword123abcdefghijklmnopqrstuv','seller', NULL);

-- ----------- LOCATIONS -----------------------------------------------
INSERT INTO location (location_id, latitude, longitude, address_line, city, state, zip_code) VALUES
(1, 19.0760, 72.8777, 'Bandra West, Mumbai',           'Mumbai','Maharashtra','400050'),  -- buyer home
(2, 19.1197, 72.8526, 'Andheri East, Mumbai',          'Mumbai','Maharashtra','400069'),  -- buyer office
(3, 19.0596, 72.8295, 'Linking Road, Bandra West',     'Mumbai','Maharashtra','400050'),  -- shop 1
(4, 19.0544, 72.8256, 'Hill Road, Bandra West',        'Mumbai','Maharashtra','400050'),  -- shop 2
(5, 19.0469, 72.8191, 'Turner Road, Bandra West',      'Mumbai','Maharashtra','400050'),  -- shop 3
(6, 19.0728, 72.8826, 'Pali Market, Bandra West',      'Mumbai','Maharashtra','400050'),  -- shop 4
(7, 19.0625, 72.8442, 'S.V. Road, Bandra West',        'Mumbai','Maharashtra','400050'),  -- shop 5
(8, 19.0521, 72.8308, 'Carter Road, Bandra West',      'Mumbai','Maharashtra','400050');  -- shop 6

-- ----------- ADDRESSES -----------------------------------------------
INSERT INTO address (address_id, user_id, label, location_id, is_default) VALUES
(1, 1, 'Home',   1, TRUE),
(2, 1, 'Office', 2, FALSE);

-- ----------- CATEGORIES (must mirror frontend list) ------------------
INSERT INTO category (category_id, name, icon, color) VALUES
(1,'Electronics','📱','bg-blue-100 text-blue-700'),
(2,'Fashion','👕','bg-purple-100 text-purple-700'),
(3,'Home & Garden','🏠','bg-green-100 text-green-700'),
(4,'Sports & Fitness','⚽','bg-orange-100 text-orange-700'),
(5,'Automotive','🚗','bg-red-100 text-red-700'),
(6,'Books & Media','📚','bg-indigo-100 text-indigo-700'),
(7,'Health & Beauty','💄','bg-pink-100 text-pink-700'),
(8,'Groceries','🛒','bg-emerald-100 text-emerald-700'),
(9,'Furniture','🪑','bg-amber-100 text-amber-700'),
(10,'Jewelry','💎','bg-cyan-100 text-cyan-700'),
(11,'Baby & Kids','🍼','bg-yellow-100 text-yellow-700'),
(12,'Pet Supplies','🐕','bg-lime-100 text-lime-700');

-- ----------- BRANDS --------------------------------------------------
INSERT INTO brand (brand_id, name) VALUES
(1,'Apple'),(2,'Samsung'),(3,'Ethnic Wear Co.'),(4,'HomeComfort'),
(5,'India Gate'),(6,'Fresh Farms'),(7,'MRF'),(8,'Jewel Craft');

-- ----------- SHOPS ---------------------------------------------------
INSERT INTO shop (shop_id, name, description, image_url, location_id, rating,
                  review_count, is_open, open_time, close_time, delivery_fee,
                  min_order_amount, phone, seller_user_id) VALUES
(1,'TechHub Electronics',
   'Premium electronics and gadgets with latest technology. Authorized dealer for Apple, Samsung, and OnePlus.',
   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
   3, 4.80, 1234, TRUE, '10:00:00','21:00:00', 49,  500,'+91 98765 43210', 2),
(2,'Fashion Junction',
   'Trendy fashion boutique featuring designer brands and ethnic wear. Perfect for all occasions.',
   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
   4, 4.60,  856, TRUE, '11:00:00','22:00:00', 59,  799,'+91 98765 43211', 3),
(3,'Home Essentials Store',
   'Complete home and garden solutions. From furniture to kitchenware, everything for Indian homes.',
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
   5, 4.70,  642, TRUE, '09:00:00','20:00:00', 89, 1500,'+91 98765 43212', 4),
(4,'Spice & Grocery Mart',
   'Fresh groceries, spices, and daily essentials. Quality products at affordable prices.',
   'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
   6, 4.90, 1567, TRUE, '07:00:00','23:00:00', 29,  299,'+91 98765 43213', 5),
(5,'AutoCare Parts',
   'Genuine auto parts and accessories for all vehicle brands. Expert advice included.',
   'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
   7, 4.50,  423, TRUE, '08:00:00','19:00:00', 99, 1000,'+91 98765 43214', 6),
(6,'Sports Zone',
   'Complete sports equipment and fitness gear. Official dealer for major sports brands.',
   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
   8, 4.40,  789, TRUE, '10:00:00','21:00:00', 79,  999,'+91 98765 43215', 7);

-- ----------- SHOP_CATEGORY (M:N) -------------------------------------
INSERT INTO shop_category (shop_id, category_id) VALUES
(1,1),                 -- TechHub  -> Electronics
(2,2),                 -- Fashion Junction -> Fashion
(3,3),(3,9),           -- Home Essentials -> Home & Garden + Furniture
(4,8),                 -- Grocery Mart -> Groceries
(5,5),                 -- AutoCare -> Automotive
(6,4);                 -- Sports Zone -> Sports & Fitness

-- ----------- PRODUCTS (canonical) ------------------------------------
INSERT INTO product (product_id, name, description, brand_id, category_id, default_image_url, unit) VALUES
(1,'iPhone 15 Pro Max',
   'The most advanced iPhone ever with titanium design, A17 Pro chip, and the best iPhone camera system.',
   1, 1,
   'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', NULL),
(2,'Samsung Galaxy S24 Ultra',
   'Ultimate mobile experience with S Pen, 200MP camera, and AI-powered features.',
   2, 1,
   'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop', NULL),
(3,'Designer Kurta Set',
   'Beautiful cotton kurta set perfect for festivals and special occasions.',
   3, 2,
   'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=400&fit=crop','Size: M'),
(4,'Wooden Dining Table',
   'Solid wood dining table for 6 people. Perfect for Indian homes and families.',
   4, 9,
   'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop','6-seater set'),
(5,'Basmati Rice Premium',
   'Premium quality basmati rice, aged for perfect aroma and taste.',
   5, 8,
   'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop','5kg pack'),
(6,'Organic Vegetables Bundle',
   'Fresh organic vegetables bundle including seasonal vegetables. Farm fresh guaranteed.',
   6, 8,
   'https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&h=400&fit=crop','2kg mixed bundle'),
(7,'Cricket Kit Professional',
   'Professional cricket kit with bat, pads, gloves, and helmet. Perfect for serious players.',
   7, 4,
   'https://images.unsplash.com/photo-1593766827228-8737b8d10b46?w=400&h=400&fit=crop','Complete kit'),
(8,'Gold Plated Earrings',
   'Beautiful gold plated earrings with traditional Indian design. Perfect for festivals.',
   8, 10,
   'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop', NULL);

-- ----------- PRODUCT_IMAGE -------------------------------------------
INSERT INTO product_image (product_id, image_url) VALUES
(1,'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'),
(1,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'),
(1,'https://images.unsplash.com/photo-1585060280525-7cd35806a87c?w=400&h=400&fit=crop'),
(2,'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop'),
(2,'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop'),
(3,'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=400&fit=crop'),
(3,'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'),
(4,'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'),
(4,'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'),
(5,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'),
(6,'https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&h=400&fit=crop'),
(6,'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop'),
(7,'https://images.unsplash.com/photo-1593766827228-8737b8d10b46?w=400&h=400&fit=crop'),
(8,'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop'),
(8,'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=400&fit=crop');

-- ----------- PRODUCT_FEATURE -----------------------------------------
INSERT INTO product_feature (product_id, feature_text) VALUES
(1,'6.7-inch Super Retina XDR Display'),(1,'A17 Pro Chip'),(1,'48MP Main Camera'),
(1,'5G Connectivity'),(1,'Titanium Design'),
(2,'6.8-inch Dynamic AMOLED Display'),(2,'Snapdragon 8 Gen 3'),(2,'200MP Camera'),
(2,'S Pen Included'),(2,'AI Features'),
(3,'Pure Cotton'),(3,'Comfortable Fit'),(3,'Machine Washable'),
(4,'Solid Wood'),(4,'6-Seater'),(4,'Scratch Resistant'),(4,'5-Year Warranty'),
(5,'Premium Quality'),(5,'Long Grain'),(5,'Aged Rice'),
(6,'100% Organic'),(6,'Farm Fresh'),(6,'Pesticide Free'),
(7,'Professional Grade'),(7,'Complete Kit'),(7,'ISI Certified Helmet'),
(8,'22K Gold Plated'),(8,'Traditional Design'),(8,'Lightweight');

-- ----------- SHOP_PRODUCT (the LISTINGS — supports comparison) -------
-- Same product (product_id) listed by multiple shops at different prices.
INSERT INTO shop_product (shop_id, product_id, price, original_price, stock_count,
                          delivery_time_text, listing_rating, listing_review_count) VALUES
-- iPhone 15 Pro Max in 2 shops
(1, 1, 134900.00, 159900.00, 25, '15-30 min', 4.80, 2547),
(2, 1, 139900.00, 159900.00, 12, '20-45 min', 4.70, 1234),
-- Samsung Galaxy S24 Ultra in 2 shops
(1, 2, 124999.00, 129999.00, 18, '15-30 min', 4.70, 1834),
(2, 2, 119999.00, 129999.00,  8, '20-45 min', 4.60,  987),
-- Designer Kurta Set
(2, 3,   2499.00,   3999.00, 12, '20-45 min', 4.60,  456),
-- Wooden Dining Table
(3, 4,  24999.00,  32999.00,  5, '30-60 min', 4.80,  234),
-- Basmati Rice Premium in 2 shops
(4, 5,    899.00,    999.00, 50, '10-25 min', 4.90,  567),
(3, 5,    849.00,    999.00, 75, '30-60 min', 4.80,  423),
-- Organic Vegetables Bundle
(4, 6,    599.00,      NULL,100, '10-25 min', 4.70,  892),
-- Cricket Kit
(6, 7,   8999.00,  12999.00, 15, '25-50 min', 4.50, 1245),
-- Gold Earrings
(2, 8,   1299.00,   1999.00, 25, '20-45 min', 4.90,  178);

-- ----------- CARTS (one per buyer is created automatically by trigger;
--             but we seed an empty cart for the buyer here) -----------
INSERT INTO cart (user_id) VALUES (1);

-- ----------- COMPARE LIST --------------------------------------------
INSERT INTO compare_list (user_id) VALUES (1);

-- ----------- DELIVERY PERSONS ----------------------------------------
INSERT INTO delivery_person (delivery_person_id, name, phone, rating, vehicle, current_location_id) VALUES
(1,'Vikas Yadav', '+91 99887 70011', 4.8, 'Bike',   1),
(2,'Sandeep Roy', '+91 99887 70022', 4.6, 'Scooter',6);

-- ----------- A SAMPLE ORDER FOR DEMO ---------------------------------
-- (in real use this is created via the sp_place_order procedure)
INSERT INTO `order` (order_id, user_id, shop_id, subtotal, delivery_fee, total,
                     status, delivery_address_id, estimated_delivery_time,
                     delivery_person_id)
VALUES (1, 1, 4, 1498.00, 29.00, 1527.00, 'out_for_delivery', 1, '10-25 min', 2);

INSERT INTO order_item (order_id, listing_id, quantity, unit_price) VALUES
(1, 7, 1, 899.00),     -- Basmati Rice (listing_id=7 is shop 4 / product 5)
(1, 9, 1, 599.00);     -- Organic Vegetable Bundle

INSERT INTO tracking_update (order_id, status, message, location_id) VALUES
(1,'placed',           'Order placed successfully',      6),
(1,'confirmed',        'Shop confirmed your order',      6),
(1,'preparing',        'Items being packed',             6),
(1,'out_for_delivery', 'Out for delivery via Sandeep',   6);
