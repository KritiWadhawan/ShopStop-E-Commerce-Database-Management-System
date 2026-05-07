# 3. Mapping ERD → Relational Schema

This step converts the ER design above into concrete relations. Each entity
becomes a table; each relationship becomes either a foreign key (for 1:N) or a
new associative table (for M:N or attributed relationships).

## 3.1 Strong entities → tables (with their own PK)
```
user(user_id, name, email, phone, password_hash, role, avatar_url, created_at)
location(location_id, latitude, longitude, address_line, city, state, zip_code)
category(category_id, name, icon, color)
brand(brand_id, name)
delivery_person(delivery_person_id, name, phone, rating, vehicle, current_location_id)
```

## 3.2 Weak / dependent entities (PK includes an FK)
```
address(address_id, user_id*, label, location_id*, is_default)
product_image(image_id, product_id*, image_url)
product_feature(feature_id, product_id*, feature_text)
tracking_update(update_id, order_id*, status, message, location_id*, event_time)
```
(`*` denotes a foreign key.)

## 3.3 1:N relationships → FK on the "many" side
* `address.user_id → user.user_id`
* `address.location_id → location.location_id`
* `shop.location_id → location.location_id`
* `shop.seller_user_id → user.user_id`
* `product.brand_id → brand.brand_id`, `product.category_id → category.category_id`
* `order.user_id`, `order.shop_id`, `order.delivery_address_id`, `order.delivery_person_id`
* `order_item.order_id`, `order_item.listing_id`
* `cart.user_id`, `cart_item.cart_id`, `cart_item.listing_id`
* `compare_list.user_id`, `compare_item.compare_id`, `compare_item.product_id`

## 3.4 M:N relationships → associative tables

### a) Shop ↔ Category
```
shop_category(shop_id, category_id)         -- composite PK
```

### b) Shop ↔ Product (the **comparison** relationship — has its own
attributes price/stock/etc., so it needs an attributed associative table)
```
shop_product(
    listing_id        SURROGATE PK,
    shop_id*, product_id*,
    price, original_price, stock_count, in_stock,
    delivery_time_text, listing_rating, listing_review_count,
    UNIQUE (shop_id, product_id)
)
```

## 3.5 Final list of relations

```
user, location, address, category, brand, shop, shop_category,
product, product_image, product_feature, shop_product,
cart, cart_item, compare_list, compare_item,
delivery_person, `order`, order_item, tracking_update, review
```

Total: **20 relations** — the physical schema is in `db/schema.sql`.
