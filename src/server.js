const express = require('express');
const app = express();
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authMiddleware = require('./middleware/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'Finance Backend API', version: '1.0.0' });
});

console.log('Setting up public routes');
app.use('/auth', authRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith('/auth/register') || req.path.startsWith('/auth/login')) {
    return next();
  }
  authMiddleware(req, res, next);
});

console.log('Setting up protected routes');
app.use('/records', recordRoutes);
app.use('/dashboard', dashboardRoutes);

const connectDB = require('./config/db');
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  return app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };