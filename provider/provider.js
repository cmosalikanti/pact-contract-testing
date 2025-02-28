// producer/producer.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/user/1', (req, res) => {
  res.json({
    id: 1,
    name: 'John Doe',
  });
});

app.get('/users', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
    ]);
  });
  
app.listen(port, () => {
  console.log(`Producer listening at http://localhost:${port}`);
});
