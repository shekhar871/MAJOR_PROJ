const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./modules/auth/auth.routes');
const pairingRoutes = require('./modules/pairing/pairing.routes');
const filesRoutes = require('./modules/files/files.routes');
const notesRoutes = require('./modules/notes/notes.routes');
const tasksRoutes = require('./modules/tasks/tasks.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes configuration and error boundary
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'pocketbridge-api', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/pairings', pairingRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tasks', tasksRoutes);

app.use(errorHandler);

module.exports = app;
