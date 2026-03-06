# SwarnaVeda - Luxury Jewellery E-Commerce Platform

## Project Overview

**SwarnaVeda** is a full-stack e-commerce demonstration platform specializing in luxury jewellery. It features a modern web application with user authentication, product catalog management, shopping cart functionality, and an admin dashboard for managing products and users.

**Version:** 1.0.0  
**License:** MIT  
**Author:** SwarnaVeda Dev

---

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v4.18.2
- **Database:** MongoDB (Mongoose v7.0.0)
- **Authentication:** JWT (jsonwebtoken v9.0.0)
- **Password Hashing:** bcryptjs v2.4.3
- **File Uploads:** Multer v1.4.5
- **CORS:** Enabled for cross-origin requests
- **Environment Management:** dotenv v16.0.0

### Frontend
- **Architecture:** Single Page Application (SPA)
- **Structure:** Multiple HTML pages with vanilla JavaScript
- **Styling:** Custom CSS

### Development Tools
- **Local Development:** Nodemon v2.0.22 (auto-reload on file changes)

---

## Project Structure

```
swarnaVeda/
├── server/                          # Backend Express application
│   ├── server.js                   # Main application entry point
│   ├── seed.js                     # Database seeding & admin setup
│   ├── config/
│   │   └── db.js                   # MongoDB connection configuration
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT authentication middleware
│   ├── models/
│   │   ├── Product.js              # Product data model
│   │   └── User.js                 # User data model
│   └── routes/
│       ├── productRoutes.js        # Product listing & browsing
│       ├── authRoutes.js           # Authentication (login/register)
│       ├── cartRoutes.js           # Shopping cart operations
│       └── adminRoutes.js          # Admin management endpoints
├── frontend/                        # Frontend SPA application
│   ├── index.html                  # Home page
│   ├── login.html                  # User login page
│   ├── register.html               # User registration page
│   ├── cart.html                   # Shopping cart page
│   ├── profile.html                # User profile page
│   ├── admin.html                  # Admin user management
│   ├── admin-dashboard.html        # Admin dashboard
│   ├── css/
│   │   └── style.css               # Global styling
│   ├── js/
│   │   ├── script.js               # Global JavaScript utilities
│   │   ├── login.js                # Login page logic
│   │   ├── register.js             # Registration page logic
│   │   ├── cart.js                 # Cart functionality
│   │   ├── profile.js              # User profile logic
│   │   ├── admin.js                # Admin user management logic
│   │   └── admin-dashboard.js      # Admin dashboard logic
│   └── images/
│       └── Emerald Earrings.avif   # Product imagery
├── package.json                    # Project dependencies & scripts
└── README.md                       # Setup & deployment guide
```

---

## Key Features

### User Features
- **User Authentication:** Register and login with secure JWT-based sessions
- **Product Browsing:** Browse luxury jewellery catalog
- **Shopping Cart:** Add/remove items, manage cart
- **User Profile:** View and manage personal information

### Admin Features
- **Product Management:** Create, update, and delete products
- **User Management:** Manage user accounts and permissions
- **Dashboard:** Admin dashboard for monitoring platform activity
- **Database Seeding:** Automatic product and admin user initialization

### Technical Features
- **Database Seeding:** Automatically populates products if database is empty
- **Admin User Creation:** Ensures at least one admin user exists
- **CORS Support:** Enables frontend-backend communication
- **Static File Serving:** Serves frontend files from the Express app
- **SPA Routing:** Falls back to index.html for all non-API routes
- **Error Handling:** Centralized error handling middleware

---

## API Endpoints

### Authentication Routes (`/api/auth`)
- User registration
- User login
- JWT token validation

### Product Routes (`/api/products`)
- Get all products
- Get single product details
- Search/filter products

### Cart Routes (`/api/cart`)
- Get user cart
- Add items to cart
- Remove items from cart
- Update cart quantities

### Admin Routes (`/api/admin`)
- Product management (CRUD)
- User management
- Dashboard statistics

---

## Setup & Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Create `.env` file from `.env.example`
   - Set `MONGO_URI` to your MongoDB Atlas connection string
   - Example: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/swarnaVeda?retryWrites=true&w=majority`

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open `http://localhost:5000` in your browser

### Production start
```bash
npm start
```

---

## Deployment

### AWS EC2 Deployment (Basic Process)
1. Launch Ubuntu 22.04 EC2 instance with ports 22, 80, 443, 5000 open
2. Install Node.js, npm, and MongoDB client
3. Clone the repository
4. Create `.env` with MongoDB URI and PORT settings
5. Install dependencies and run with process manager (e.g., pm2)
6. Optionally configure Nginx as reverse proxy for ports 80/443

---

## Database Models

### User Model
- Stores user account information
- Includes password hashing with bcryptjs
- JWT token support for authentication

### Product Model
- Contains jewellery product information
- Includes pricing and inventory data
- Supports admin product management

---

## Development Workflow

### Available Scripts
- `npm start` - Run the production server
- `npm run dev` - Run development server with auto-reload (Nodemon)

### Development Notes
- Backend runs on port 5000
- Frontend served from the same server (no separate dev server needed)
- Changes to files automatically trigger server reload with Nodemon

---

## Security Features

- **Password Hashing:** bcryptjs for secure password storage
- **JWT Authentication:** Secure token-based authentication
- **CORS:** Controlled cross-origin requests
- **Protected Routes:** Authentication middleware on protected endpoints

---

## Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| mongoose | ^7.0.0 | MongoDB ODM |
| cors | ^2.8.5 | Cross-origin support |
| jsonwebtoken | ^9.0.0 | JWT authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| multer | ^1.4.5 | File uploads |
| dotenv | ^16.0.0 | Environment variables |
| nodemon | ^2.0.22 | Auto-reload (dev only) |

---

## Notes

- This is a **demonstration project** for learning full-stack development
- The admin user is automatically created on first startup
- Products are seeded automatically if the database is empty
- MongoDB Memory Server is included as a dependency for testing purposes

