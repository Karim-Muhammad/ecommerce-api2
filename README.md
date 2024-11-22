# eCommerce API

A good start eCommerce REST API built with Node.js, Express. designed to handle core functionalities of an online store, including user authentication, product management, and order processing.

## Features:

1. User Management
   User registration and authentication (JWT-based).
   Role-based authorization for admin and customer functionalities.
   Profile management: update user details and password reset.
2. Product Management
   CRUD operations for products (create, read, update, delete).
   Product search and filtering by categories and brands.
   Support for multiple product images.
3. Category and Brand Management
   Creation and management of product categories.
   Management of brand information.
4. Cart and Orders
   Add and remove items from the shopping cart.
   Order creation and tracking.
   Order history retrieval for users.
5. Payment Integration
   Basic integration with payment gateways (e.g., Stripe or PayPal).
6. Admin Dashboard
   Manage users, orders, products, categories, and brands.
   <del>Access to analytics for tracking sales and inventory</del>.
7. Reviews and Ratings
   Users can rate and review products.
   Admin moderation for reviews.
8. Security
   Data validation using Mongoose schemas.
   Middleware for input sanitization and error handling.
   <del>Protection against common security vulnerabilities (e.g., XSS, CSRF).</del>
9. Pagination and Sorting
   Efficient pagination for large datasets.
   Sort results by date, rating, or price.
10. API Documentation
    Comprehensive API documentation using **Postman** or similar tools.

### API

**Documentation**: https://documenter.getpostman.com/view/23054100/2sAYBSmEBp

**API link**: https://egroccery.onrender.com/api/v1

### Deployed on

API built with Nodejs + MongoDB as a Datbase (Mongoose).
API deployed on Render.com

### How to Start

```bash
git clone <repo-url>
cd <repo-name>

npm install # install all dependencies
npm run start:dev # to start server on your local machine
```
