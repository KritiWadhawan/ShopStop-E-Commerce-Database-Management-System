# 4. Normalization

The mock data started as a single denormalised JSON object per product
where the *shop* (with its address, opening hours, rating, etc.) was nested
inside *every* product row, and the product had multi-valued attributes
(`images`, `features`). Below we walk the design through 1NF → BCNF.

---

## 4.1 Un-normalised form (UNF)

A typical product record from `mockData.ts`:

```
PRODUCT(
  id, name, price, originalPrice, image, images[], category, brand,
  description, features[], rating, reviewCount,
  shop{ id, name, description, image, location{lat,lon,addr,city,state,zip},
        rating, reviewCount, isOpen, openHours{open,close},
        deliveryTime, deliveryFee, minOrderAmount, phone, categories[],
        sellerId },
  inStock, stockCount, deliveryTime, unit
)
```

Problems:
* multi-valued attributes (`images`, `features`, `categories`),
* shop information repeated for every product the shop sells (update anomaly),
* category / brand are simple strings repeated everywhere.

---

## 4.2 First Normal Form (1NF)
*Rule: every attribute holds an atomic value.*

* Move `images[]` to a dependent table **product_image(product_id, url)**.
* Move `features[]` to **product_feature(product_id, feature)**.
* Move shop's `categories[]` to **shop_category(shop_id, category_id)**.
* Split `openHours{open,close}` into `open_time`, `close_time` columns.
* Split `location{...}` into separate columns (later moved to its own table).

Result: every column now stores a single, atomic value.

---

## 4.3 Second Normal Form (2NF)
*Rule: 1NF **and** no non-prime attribute depends on a *part* of a
composite key.*

Most tables already have a single-column surrogate PK so 2NF is trivial.
The associative table that needed care was the original
`product_in_shop(shop_id, product_id, …)` — every non-key attribute
(`price`, `stock_count`, `delivery_time_text`, …) depends on the *whole*
composite key, not just `shop_id` or just `product_id`. Good. We still
introduce a surrogate `listing_id` to make foreign keys (in
`cart_item`, `order_item`, `review`) cleaner.

---

## 4.4 Third Normal Form (3NF)
*Rule: 2NF **and** no non-prime attribute is transitively dependent on the
PK.*

Transitive dependencies removed:

| Original                                     | Problem (transitive)                | Fix                                              |
| -------------------------------------------- | ----------------------------------- | ------------------------------------------------ |
| `product(brand_name, category_name, …)`      | `product → brand_name` and brand has its own attributes (popularity, logo) | extract **brand** and **category** tables, keep FK |
| `shop(city, state, zip_code, lat, lon, …)`   | `shop → zip_code → city, state`     | extract **location** table (also reused by `address`) |
| `address(label, city, state, …)`             | same as above                        | reuse **location** table                          |
| `product(rating, review_count)` *for the canonical product* | rating actually depends on the **listing**, not the canonical product | move `rating` & `review_count` to **shop_product** |

After this, every non-key column depends on the **whole** key and **only**
on the key.

---

## 4.5 Boyce-Codd Normal Form (BCNF)
*Rule: for every non-trivial functional dependency `X → Y`, X must be a
super-key.*

We checked each table:

* `user`: `email → user_id` (email is unique) and vice-versa, both are
  candidate keys ⇒ BCNF.
* `shop_product`: candidate keys are `listing_id` and `(shop_id, product_id)`.
  No other determinant exists ⇒ BCNF.
* `address`: `address_id` is the only candidate key, all dependencies start
  from it ⇒ BCNF.
* All other tables: a single surrogate PK is the only candidate key, so
  trivially BCNF.

The schema is therefore in **BCNF**. No further decomposition is needed
without losing useful joins.

---

## 4.6 Trade-offs deliberately accepted

* `shop.rating` and `shop.review_count` are *cached aggregates*. Strict 3NF
  would forbid storing them because they are derivable from `review`. We keep
  them for read performance and refresh them inside a trigger
  (`trg_after_review_insert`).
* `order.subtotal`, `order.total` are also stored — derivable from
  `order_item` rows, but kept for atomicity of historical orders (prices
  change later).

These are standard *controlled denormalisations*, documented and maintained
by triggers.
