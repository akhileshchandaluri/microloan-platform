require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});
app.use('/api/', limiter);

// API Routes - IMPORTANT: Order matters!
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ success: true, message: 'MicroLoan API Server' });
});

// 404 handler - must be after all routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ success: false, message: 'API route not found', path: req.path });
});

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n✓ Backend Server running on http://localhost:${PORT}`);
  console.log(`✓ Available endpoints:`);
  console.log(`  - POST /api/auth/signup`);
  console.log(`  - POST /api/auth/login`);
  console.log(`  - GET /api/auth/profile`);
  console.log(`  - POST /api/loans/apply`);
  console.log(`  - GET /api/loans/my-loans`);
  console.log(`  - GET /api/loans/all`);
  console.log(`  - PUT /api/loans/update-status`);
  console.log(`  - GET /api/admin/loans`);
  console.log(`  - PUT /api/admin/loans/:loanId/status`);
  console.log(`  - GET /api/admin/stats`);
  console.log(`  - GET /api/admin/users`);
  console.log(`✓ MongoDB connected\n`);
});

module.exports = app;