// index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, this is your Shopify extension app!');
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});