require('dotenv').config();
const express = require('express');
const cors = 'cors';

const eventRoutes = require('./src/api/routes/eventRoutes');
const userRoutes = require('./src/api/routes/userRoutes');
const errorHandler = require('./src/api/middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(require('cors')());    // To enable Cross-Origin Resource Sharing

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
