const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const { initializeSocket } = require('./socket');
require('dotenv').config();

console.log('Environment Check:');
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Defined' : 'Undefined (using fallback)');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Defined' : 'Undefined');
console.log('- REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? 'Defined' : 'Undefined');
console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'Defined' : 'Undefined');

const app = express();
const server = http.createServer(app);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 1000, // Increased for debugging
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again after a minute'
//   }
// });
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
  });
  next();
});
// app.use(limiter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CabZee API is running',
    timestamp: new Date().toISOString()
  });
});

// Stripe webhook needs raw body, registered BEFORE express.json()
app.use('/api/payments', require('./routes/payment'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/chat', require('./routes/chat'));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CabZee API is running',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uber')
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      const User = require('./models/User');
      const existingAdmin = await User.findOne({ email: 'divythakkar318@gmail.com' });

      if (!existingAdmin) {
        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync('admin123', salt);

        const adminUser = new User({
          name: 'divy',
          email: 'divythakkar318@gmail.com',
          password: hashedPassword,
          phone: '+1234567890',
          role: 'admin',
          isVerified: true
        });
        await adminUser.save();
        console.log('Default admin user created: divy (divythakkar318@gmail.com) with password: admin123');
      }
    } catch (error) {
      console.error('Error creating default admin user:', error);
    }

    // Initialize default settings
    try {
      const Settings = require('./models/Settings');
      await Settings.getSettings();
      console.log('System settings initialized');
    } catch (error) {
      console.error('Error initializing settings:', error);
    }

    // Initialize Socket.io
    initializeSocket(server);
    console.log('Socket.io initialized');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io ready for connections`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });