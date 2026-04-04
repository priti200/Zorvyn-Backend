const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/records', recordRoutes);