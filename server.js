const express = require("express");
const postsRouter = require('./data/posts/posts-router')

const server = express();
server.use(express.json());

server.use('/api/posts', postsRouter);

server.get("/", (req, res) => {
    res.send(`<h2>Welcome to Fady's API</h2`);
});

module.exports = server;