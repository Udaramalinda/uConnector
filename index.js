require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT;
console.log(PORT);

app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:4200', 'http://127.0.0.1:4200']
    })
);

require('./routes/whatsapp.webhook.routes')(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});