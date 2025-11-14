require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 5000;

// connect DB
connectDB();

// middlewares
app.use(helmet());
app.use(cors()); // adjust options later for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120 // limit per minute
});
app.use(limiter);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
