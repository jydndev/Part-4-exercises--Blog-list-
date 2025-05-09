const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const deletedBlog = await Blog.findByIdAndRemove(request.params.id);

    if (deletedBlog) {
      response.status(204).end();
    } else {
      response.status(404).json({ error: 'blog not found' });
    }
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

module.exports = blogsRouter;
