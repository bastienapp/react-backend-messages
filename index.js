const express = require('express');
require('dotenv').config();
const cors = require('cors');
const messagesRouter = require('./routes/messages');
const app = express();

app.use(express.json());

const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use('/messages', messagesRouter);

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
