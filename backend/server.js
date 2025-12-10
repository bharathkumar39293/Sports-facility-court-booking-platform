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
app.use(cors());
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

