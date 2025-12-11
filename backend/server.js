require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB } = require('./config/db');

// routes
const courtsRoutes = require('./routes/courts');
const coachesRoutes = require('./routes/coaches');
const equipmentRoutes = require('./routes/equipment');
const pricingRoutes = require('./routes/pricing');
const bookingsRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();

// CORS: allow one or many origins via FRONTEND_URL or CORS_ORIGINS (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(bodyParser.json());

connectDB();

app.use('/api/courts', courtsRoutes);
app.use('/api/coaches', coachesRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

