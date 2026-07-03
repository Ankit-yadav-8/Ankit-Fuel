import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import stationRoutes from './routes/stations.js';
import queueRoutes from './routes/queues.js';
import reviewRoutes from './routes/reviews.js';
import rewardRoutes from './routes/rewards.js';
import routeRoutes from './routes/route.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/route', routeRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Fuel-India API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      stations: '/api/stations',
      queues: '/api/queues',
      reviews: '/api/reviews',
      rewards: '/api/rewards',
      route: '/api/route',
      admin: '/api/admin'
    }
  });
});

// ─── 404 Handler ────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ─── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║                                              ║');
    console.log('║     ⛽  Fuel-India API Server                ║');
    console.log(`║     🌐  http://localhost:${PORT}               ║`);
    console.log(`║     📦  Environment: ${process.env.NODE_ENV || 'development'}        ║`);
    console.log('║                                              ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
    console.log('Available endpoints:');
    console.log('  POST   /api/auth/register');
    console.log('  POST   /api/auth/login');
    console.log('  POST   /api/auth/google');
    console.log('  POST   /api/auth/send-otp');
    console.log('  POST   /api/auth/verify-otp');
    console.log('  GET    /api/auth/me');
    console.log('  PUT    /api/auth/profile');
    console.log('  ─────────────────────────────');
    console.log('  GET    /api/stations');
    console.log('  GET    /api/stations/nearby?lat=&lng=&radius=');
    console.log('  GET    /api/stations/search?q=');
    console.log('  GET    /api/stations/:id');
    console.log('  POST   /api/stations          (admin)');
    console.log('  PUT    /api/stations/:id       (admin)');
    console.log('  DELETE /api/stations/:id       (admin)');
    console.log('  ─────────────────────────────');
    console.log('  POST   /api/queues/report');
    console.log('  GET    /api/queues/station/:id');
    console.log('  GET    /api/queues/station/:id/predict');
    console.log('  ─────────────────────────────');
    console.log('  POST   /api/reviews');
    console.log('  GET    /api/reviews/station/:id');
    console.log('  DELETE /api/reviews/:id');
    console.log('  ─────────────────────────────');
    console.log('  GET    /api/rewards/balance');
    console.log('  GET    /api/rewards/history');
    console.log('  POST   /api/rewards/redeem');
    console.log('  ─────────────────────────────');
    console.log('  POST   /api/route/plan');
    console.log('  POST   /api/route/save');
    console.log('  GET    /api/route/saved');
    console.log('  DELETE /api/route/saved/:id');
    console.log('  ─────────────────────────────');
    console.log('  GET    /api/admin/dashboard');
    console.log('  GET    /api/admin/users');
    console.log('  PUT    /api/admin/users/:id/role');
    console.log('  GET    /api/admin/analytics/peak-hours');
    console.log('  GET    /api/admin/analytics/city-heatmap');
    console.log('  GET    /api/admin/analytics/demand');
    console.log('  ─────────────────────────────');
    console.log('  GET    /api/health');
    console.log('');
  });
};

startServer();
