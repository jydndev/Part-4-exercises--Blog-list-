const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const Blog = require('./models/blog');
const blogsRouter = require('./controllers/blogs');

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(blogs);
    console.log('Dummy data inserted');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });

app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
