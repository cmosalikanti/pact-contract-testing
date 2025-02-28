// producer/producer.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((_, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

server.get('/user/1', (req, res) => {
    res.json({
        id: 1,
        name: 'John Doe',
    });
});

server.get('/users', (req, res) => {
    res.json([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
    ]);
});

module.exports = { server };