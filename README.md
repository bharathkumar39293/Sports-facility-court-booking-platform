# Acorn-Globus Court Booking System

A full-stack court booking system with dynamic pricing, availability management, and resource allocation.

## Project Structure

```
/root
  ├── backend/          # Node.js + Express + MongoDB backend
  ├── frontend/         # React + Vite + Tailwind frontend
  ├── seed-data.json    # Initial data for seeding database
  └── README.md
```

## Features

- **Court Booking**: Book indoor/outdoor courts with time slot selection
- **Dynamic Pricing**: Peak hours, weekend surcharges, court type premiums, holiday pricing
- **Resource Management**: Coaches and equipment (rackets, shoes) booking
- **Availability Engine**: Real-time availability checks for courts, coaches, and equipment
- **Price Preview**: See pricing breakdown before confirming booking

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Transaction-based booking for data consistency

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios for API calls

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/acorn-globus
PORT=4000
```

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```
VITE_API_URL=http://localhost:4000/api
```

4. Start the dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Seeding Data

To seed the database with initial data, you can create a simple script or use MongoDB Compass/CLI to import the `seed-data.json` file.

Example seed script (create `backend/scripts/seed.js`):

```js
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');
const seedData = require('../../seed-data.json');

async function seed() {
  await connectDB();
  await Court.insertMany(seedData.courts);
  await Coach.insertMany(seedData.coaches);
  await Equipment.insertMany(seedData.equipment);
  await PricingRule.insertMany(seedData.pricingRules);
  console.log('Database seeded!');
  process.exit(0);
}

seed();
```

Run with: `node backend/scripts/seed.js`

## API Endpoints

### Courts
- `GET /api/courts` - Get all active courts
- `GET /api/courts/slots?date=YYYY-MM-DD` - Get available slots for a date

### Bookings
- `POST /api/bookings/price` - Preview price breakdown
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/history/:userId` - Get booking history

### Coaches
- `GET /api/coaches` - Get all active coaches

### Equipment
- `GET /api/equipment` - Get all equipment

### Pricing
- `GET /api/pricing/rules` - Get active pricing rules

## Pricing Rules

The system supports multiple pricing rule types:

- **Peak Hours**: Multiplier applied during specific hours (e.g., 6 PM - 9 PM)
- **Weekend Surcharge**: Fixed surcharge for weekends
- **Court Type**: Premium for specific court types (indoor/outdoor)
- **Holiday**: Surcharge for specific dates

## Notes

- Booking uses MongoDB transactions for atomicity
- Equipment availability is calculated by summing overlapping bookings
- For production, consider caching pricing rules with Redis
- User authentication is not implemented in this skeleton (replace `temp-user-id` with actual auth)

## Next Steps

1. Add user authentication (JWT/OAuth)
2. Implement waitlist functionality
3. Add email notifications
4. Build admin dashboard for managing courts, coaches, and pricing rules
5. Add booking cancellation and refund logic
6. Implement payment gateway integration

