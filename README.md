# eCommerce API

A REST API for the core workflows of an online store, built with Node.js, Express, MongoDB, and Mongoose. It covers catalog administration, account security, carts, coupons, orders, reviews, wishlists, addresses, and role-based operations.

[Postman documentation](https://documenter.getpostman.com/view/23054100/2sAYBSmEBp) · [Hosted API](https://egroccery.onrender.com/api/v1) · [Repository](https://github.com/Karim-Muhammad/ecommerce-api2)

## Features

- Registration, sign-in, sign-out, email verification, and account activation
- Forgot/reset/change-password workflows
- JWT authentication and role restrictions for users, vendors, and administrators
- User profiles and profile-image processing
- Categories, nested subcategories, brands, and products
- Multiple product images, validation, filtering, sorting, field selection, and pagination
- Shopping cart quantity management and coupon application
- Cash orders with payment and delivery status transitions
- Product reviews and ratings
- Wishlists and delivery addresses
- Reusable CRUD controllers, asynchronous error handling, and centralized errors
- Database seed data and learning notes for the API's design decisions

## Tech Stack

- Node.js
- Express 5 beta
- MongoDB and Mongoose
- JSON Web Tokens and bcrypt
- Express Validator and Joi
- Multer and Sharp
- Nodemailer
- Morgan and `qs`

## Architecture

```text
.
├── config/                    # Runtime configuration
├── public/                    # Static landing page assets
├── src/
│   ├── controllers/           # HTTP request handlers
│   ├── database/              # Factories and seeders
│   ├── middlewares/           # Authentication, uploads, errors, params
│   ├── models/                # Mongoose schemas, hooks, methods, virtuals
│   ├── routes/                # `/api/v1` route modules
│   ├── rules/                 # Request validation rules
│   ├── services/              # Storage adapters
│   ├── utils/                 # Errors, CRUD helpers, queries, email, DB setup
│   └── validators/            # Validation response handling
├── lessons/                   # Notes about API and Mongoose concepts
└── server.js                  # Application entry point
```

Requests flow through route-specific validation and authentication middleware before reaching controllers and Mongoose models. Shared utilities provide query features, CRUD behavior, error propagation, email delivery, and database setup.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB locally or through MongoDB Atlas
- SMTP credentials for verification and password-recovery email

### Installation

```bash
git clone https://github.com/Karim-Muhammad/ecommerce-api2.git
cd ecommerce-api2
npm install
cp .env.example .env
```

Complete `.env` with the variables consumed by `config/index.js`:

| Variable | Purpose | Example |
| --- | --- | --- |
| `BASE_URL` | Public server origin | `http://localhost:8000` |
| `PORT` | HTTP port | `8000` |
| `NODE_ENV` | Runtime mode | `development` |
| `CONNECTION_STRING` | MongoDB connection URI | `mongodb://127.0.0.1:27017/ecommerce` |
| `SECRET_KEY` | JWT signing secret | a long random value |
| `MAIL_HOST` | SMTP hostname | provider-specific |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_SECURE` | Whether SMTP uses a secure socket | `false` |
| `MAIL_USER` | SMTP username | provider-specific |
| `MAIL_PASSWORD` | SMTP password/app password | provider-specific |

Never commit the completed `.env` file.

Start the development server:

```bash
npm run start:dev
```

The local API root is normally `http://localhost:8000/api/v1`.

## API Domains

| Base path | Responsibilities |
| --- | --- |
| `/api/v1/auth` | Authentication, verification, password, and account actions |
| `/api/v1/users` | User administration and profile images |
| `/api/v1/categories` | Category CRUD and nested subcategory access |
| `/api/v1/sub-categories` | Subcategory CRUD |
| `/api/v1/brands` | Brand CRUD |
| `/api/v1/products` | Product CRUD, images, filters, sorting, and pagination |
| `/api/v1/reviews` | Review and rating CRUD |
| `/api/v1/wishlist` | Add, remove, and list wishlist products |
| `/api/v1/address` | Add, remove, and list delivery addresses |
| `/api/v1/coupons` | Coupon CRUD |
| `/api/v1/cart` | Cart items, quantities, clearing, and coupon application |
| `/api/v1/orders` | Cash checkout, order list, payment, and delivery status |
| `/api/v1/app-settings` | Application settings resource |

Representative routes:

```text
POST   /api/v1/auth/signup
POST   /api/v1/auth/signin
GET    /api/v1/auth/me
POST   /api/v1/products
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/cart
PATCH  /api/v1/cart/apply-coupon
POST   /api/v1/orders/cash
PATCH  /api/v1/orders/:orderId/pay
PATCH  /api/v1/orders/:orderId/deliver
```

Use the [Postman documentation](https://documenter.getpostman.com/view/23054100/2sAYBSmEBp) for complete request bodies and examples. The route modules under `src/routes/` are the source of truth for current paths.

## Scripts

| Command | Description |
| --- | --- |
| `npm run start:dev` | Run the server with Nodemon in development mode |
| `npm run start:prod` | Run the server with `NODE_ENV=production` |

## Project Status

The principal catalog, identity, cart, coupon, order, review, wishlist, and address flows are implemented. Automated tests and a production process manager are recommended next steps.

## License

The package metadata declares the ISC license. No standalone license file is currently included.
