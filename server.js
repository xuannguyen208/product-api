const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Route kiểm tra server
app.get('/', (req, res) => {
  res.json({
    message: 'Product API is running'
  });
});

app.get('/health', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB is not connected');
    }

    await mongoose.connection.db.admin().command(
      { ping: 1 },
      { timeoutMS: 2000 }
    );

    return res.status(200).json({
      status: 'OK',
      server: 'UP',
      database: 'CONNECTED',
      message: 'Product API is healthy'
    });
  } catch (error) {
    return res.status(503).json({
      status: 'ERROR',
      server: 'UP',
      database: 'UNAVAILABLE',
      message: 'MongoDB health check failed'
    });
  }
});

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });