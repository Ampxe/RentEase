# RentEase - Furniture & Appliance Rental Platform

A full-stack web application for renting furniture and appliances on a monthly basis, built with Node.js, Express, and vanilla HTML/CSS/JavaScript.

## Features

- Browse furniture & appliance listings with search
- Add items to cart (persisted in browser localStorage)
- Checkout flow that saves orders on the server
- Admin dashboard to add new products
- Simple login system

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Data storage:** JSON files (no database setup required)

## Setup Instructions

1. Make sure [Node.js](https://nodejs.org) is installed (v14 or higher).
2. Open this folder in VS Code.
3. Open a terminal in the project root and install dependencies:

   ```
   npm install
   ```

4. Start the server:

   ```
   npm start
   ```

5. Open your browser and go to:

   ```
   http://localhost:3000
   ```

## Admin Login

```
Email: admin@rentease.com
Password: admin123
```

## Project Structure

```
rentease-fullstack/
├── server.js              # Express server & API routes
├── package.json            # Dependencies
├── data/
│   ├── products.json       # Product data (auto-created)
│   └── orders.json         # Order data (auto-created)
└── public/
    ├── index.html           # Homepage
    ├── products.html        # Product listing
    ├── cart.html            # Cart page
    ├── checkout.html        # Checkout page
    ├── login.html            # Login page
    ├── admin.html            # Admin dashboard
    ├── css/style.css
    ├── js/script.js
    └── images/               # Product images
```

## API Endpoints

| Method | Route              | Description             |
|--------|---------------------|--------------------------|
| GET    | /api/products        | Get all products         |
| GET    | /api/products/:id     | Get single product       |
| POST   | /api/products         | Add new product (admin)  |
| POST   | /api/checkout          | Submit an order           |
| GET    | /api/orders            | Get all orders (admin)   |
| POST   | /api/login              | Login                     |
