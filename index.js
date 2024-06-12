require('dotenv').config();
require('reflect-metadata');

const express = require('express');
const cors = require('cors');

// Database connection
const db = require('./src/configs/db');

// db.authenticate()
//   .then(() => {
//     console.log('Database connected...');
//   })
//   .catch((err) => {
//     console.log('Error connecting to the database', err);
//   });

// Create express app
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  })
);

require('./src/routes/whatsapp.webhook.routes')(app);
require('./src/routes/messenger.webhook.routes')(app);
// require('./routes/instagram.webhook.routes')(app);

require('./src/routes/common.routes')(app);

// chatUI routes
require('./src/routes/chat-routes/user.register.routes')(app);

// Set port, listen for requests
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
