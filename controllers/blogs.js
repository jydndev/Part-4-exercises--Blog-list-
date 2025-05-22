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

blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid blog ID' });
  }

  try {
    const result = await Blog.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid blog ID' });
  }
});

module.exports = blogsRouter;
