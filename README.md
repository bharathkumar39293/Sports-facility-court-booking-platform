# Acorn-Globus Court Booking System

A full-stack court booking system with dynamic pricing, availability management, authentication, and resource allocation.

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
- **Auth**: JWT-based login/register with protected routes for admin actions

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
MONGODB_URI=mongodb://localhost:27017/acorn-globus   # or your Atlas URI
PORT=4000
JWT_SECRET=change-me
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

`seed-data.json` is already wired to `backend/scripts/seed.js`. After configuring `.env` and installing deps:

```
cd backend
npm run seed
```

This loads courts, coaches, equipment, and pricing rules.

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account and return JWT
- `POST /api/auth/login` - Login and return JWT
- `GET /api/auth/me` - Get current user (requires `Authorization: Bearer <token>`)

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
- Set a strong `JWT_SECRET` in production and keep it out of git



