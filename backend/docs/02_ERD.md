# 2. Entity-Relationship Diagram (ERD)

## 2.1 Entities and their attributes
(Primary keys are underlined with `__`, foreign keys are marked `(FK)`.)

* **USER** ( __user_id__, name, email, phone, password_hash, role,
  avatar_url, created_at )
* **LOCATION** ( __location_id__, latitude, longitude, address_line, city,
  state, zip_code )
* **ADDRESS** ( __address_id__, user_id (FK), label, location_id (FK),
  is_default )
* **CATEGORY** ( __category_id__, name, icon, color )
* **BRAND** ( __brand_id__, name )
* **SHOP** ( __shop_id__, name, description, image_url, location_id (FK),
  rating, review_count, is_open, open_time, close_time, delivery_fee,
  min_order_amount, phone, seller_user_id (FK) )
* **SHOP_CATEGORY** ( __shop_id (FK)__, __category_id (FK)__ )
* **PRODUCT** ( __product_id__, name, description, brand_id (FK),
  category_id (FK), default_image_url, unit )
* **PRODUCT_IMAGE** ( __image_id__, product_id (FK), image_url )
* **PRODUCT_FEATURE** ( __feature_id__, product_id (FK), feature_text )
* **SHOP_PRODUCT** *(the listing — same product, many shops)*
  ( __listing_id__, shop_id (FK), product_id (FK), price, original_price,
  stock_count, in_stock, delivery_time_text, listing_rating,
  listing_review_count )
* **CART** ( __cart_id__, user_id (FK) )
* **CART_ITEM** ( __cart_item_id__, cart_id (FK), listing_id (FK), quantity )
* **COMPARE_LIST** ( __compare_id__, user_id (FK) )
* **COMPARE_ITEM** ( __compare_item_id__, compare_id (FK), product_id (FK) )
* **DELIVERY_PERSON** ( __delivery_person_id__, name, phone, rating, vehicle,
  current_location_id (FK) )
* **`ORDER`** ( __order_id__, user_id (FK), shop_id (FK), subtotal,
  delivery_fee, total, status, delivery_address_id (FK),
  estimated_delivery_time, actual_delivery_time, delivery_person_id (FK),
  created_at, updated_at )
* **ORDER_ITEM** ( __order_item_id__, order_id (FK), listing_id (FK),
  quantity, unit_price )
* **TRACKING_UPDATE** ( __update_id__, order_id (FK), status, message,
  location_id (FK), event_time )
* **REVIEW** ( __review_id__, user_id (FK), listing_id (FK), rating, comment,
  created_at )

## 2.2 Relationships

| Relationship                          | Cardinality |
| ------------------------------------- | ----------- |
| USER 1—N ADDRESS                       | one user has many addresses |
| LOCATION 1—N ADDRESS                   | a location row underpins each address |
| USER 1—1 SHOP (when role = 'seller')   | a seller owns one shop |
| SHOP 1—N SHOP_PRODUCT                  | a shop lists many products |
| PRODUCT 1—N SHOP_PRODUCT               | the same product is listed by many shops *(this is the comparison relationship)* |
| CATEGORY 1—N PRODUCT                   | a category groups many products |
| BRAND 1—N PRODUCT                      | a brand owns many products |
| SHOP M—N CATEGORY (via SHOP_CATEGORY)  | a shop can serve several categories |
| PRODUCT 1—N PRODUCT_IMAGE / PRODUCT_FEATURE | weak entities of product |
| USER 1—1 CART                          | each buyer has one active cart |
| CART 1—N CART_ITEM                     | cart contains many lines |
| SHOP_PRODUCT 1—N CART_ITEM             | a listing may appear in many carts |
| USER 1—1 COMPARE_LIST                  | one comparison list per user |
| COMPARE_LIST 1—N COMPARE_ITEM          | the user adds canonical PRODUCTs to it |
| USER 1—N ORDER                         | a buyer places many orders |
| SHOP 1—N ORDER                         | a shop receives many orders |
| ORDER 1—N ORDER_ITEM                   | an order contains many lines |
| ORDER 1—N TRACKING_UPDATE              | each status change is logged |
| DELIVERY_PERSON 1—N ORDER              | a courier delivers many orders |
| USER 1—N REVIEW, SHOP_PRODUCT 1—N REVIEW | reviews link buyer to listing |

## 2.3 ASCII ER sketch

```
                +-----------+         +---------------+
                |  USER     |1-------*|  ADDRESS      |
                +-----------+         +---------------+
                  |1   |1                  *|
                  |    |                    |
                  |    |1                   v
                  |    +------------>+----------+
                  |     owns shop    | LOCATION |
                  |                  +----------+
                  v1                       ^
                +------+   1*  +---------------+ *1 +--------+
                | SHOP |-------| SHOP_PRODUCT  |----| PRODUCT|
                +------+       +---------------+    +--------+
                  |* *|              |* *|             |* *
                  |   |              |   |             |
                  v   v              v   v             v
              SHOP_CAT-CATEGORY  CART_ITEM        PROD_IMAGE/FEATURE
                                                     |
            +---------+  1* +-------+ *1  +----------+
            |  ORDER  |-----|ORDER_ |-----| SHOP_PROD|
            +---------+     | ITEM  |     +----------+
              |   |  1*     +-------+
              |   v
              |  TRACKING_UPDATE
              v
          DELIVERY_PERSON
```

A graphical version (`erd.dbml` / `erd.png`) can be generated with
[dbdiagram.io](https://dbdiagram.io) using the schema in `db/schema.sql`.
