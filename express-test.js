const express = require('express');
const app = express();
const PORT = 8001; // Different port for testing

// Basic test route
app.get('/test', (req, res) => {
  res.send('Express is working');
});

// File test route
app.get('/test-file', (req, res) => {
  res.sendFile(__dirname + '/test.txt');
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});