const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const Blog = require('./models/blog');
const blogsRouter = require('./controllers/blogs');

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => console.error('error connecting to MongoDB: ', err.message));

app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
