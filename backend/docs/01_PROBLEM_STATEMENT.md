# 1. Problem Statement

## Project: ShopStop — Hyperlocal E-Commerce Website with Product Comparison

### 1.1 Background
Local shoppers in Indian cities currently have to visit multiple websites or
walk into several shops to find the best price for the same product. There is
no single platform that lets a buyer:

* see the **same product listed by multiple nearby shops**,
* compare those listings on **price, distance, delivery time and stock**, and
* place an order from the cheapest / nearest seller in one click.

Sellers, on the other hand, lack a lightweight portal where they can publish
their catalogue, manage stock and track their orders.

### 1.2 Objective
Design and implement a relational database backed e-commerce application that
supports two kinds of users:

| Role   | Capabilities                                                                                                                              |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Buyer  | Register / login, set delivery location, browse categories, search products, compare prices for the same product across shops, manage cart, place orders, track orders, write reviews. |
| Seller | Register a shop, manage product listings (price, stock), receive orders, update order status, view dashboard analytics.                  |

### 1.3 Functional requirements

1. Users (buyers and sellers) and shops must be persistently stored.
2. Each shop has a geographic location and metadata (rating, opening hours,
   minimum order, delivery fee).
3. The same canonical *Product* (e.g. "iPhone 15 Pro Max") can be listed by
   many shops at different prices — this is the **comparison** feature.
4. Buyers can add listings to a cart (cart is per-buyer, items belong to a
   particular shop's listing).
5. An *Order* is created from one shop only; cart items from different shops
   produce separate orders.
6. Stock is decremented atomically when an order is placed.
7. Orders progress through a fixed lifecycle:
   `placed → confirmed → preparing → out_for_delivery → delivered` (or
   `cancelled`) and each transition is logged to a tracking table.
8. Reviews update the aggregate rating of the product listing automatically.
9. Sellers see live dashboard data: revenue, orders pending, top products.

### 1.4 Non-functional requirements

* Data integrity through foreign keys, constraints and triggers.
* Normalised to **3NF / BCNF** to remove redundancy.
* Server side enforcement of business rules through **stored procedures and
  triggers**, not just application code.
* Demonstrable usage of **nested and correlated sub-queries**, **aggregate
  queries**, **joins**, **functions**, **procedures** and **triggers** as
  required by the assignment.

### 1.5 Out of scope
Real online payments, real-time courier GPS feeds and email/SMS notifications
are mocked.
