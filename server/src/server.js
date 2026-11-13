require('dotenv').config();
const app = require('./app');
const errorHandler = require('./middleware/errorHandler');

// Register routes
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PocketBridge Server running on http://0.0.0.0:${PORT}`);
});
