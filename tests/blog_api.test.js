const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('blog posts have id property instead of _id', async () => {
  const response = await api.get('/api/blogs');
  const blog = response.body[0];

  assert.strictEqual(blog.id !== undefined, true);
  assert.strictEqual(blog._id === undefined, true);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 10,
  };

  const initialResponse = await api.get('/api/blogs');
  const initialCount = initialResponse.body.length;

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, initialCount + 1);

  const titles = response.body.map((b) => b.title);
  assert(titles.includes('Test Blog'));

  const addedBlog = response.body.find((b) => b.title === 'Test Blog');
  assert.strictEqual(addedBlog.author, 'Test Author');
  assert.strictEqual(addedBlog.url, 'http://testblog.com');
  assert.strictEqual(addedBlog.likes, 10);
});

test('if likes property is missing, default to 0', async () => {
  const newBlog = {
    title: 'Test Blog Without Likes',
    author: 'Test Author',
    url: 'http://testblog.com',
    // likes property is intentionally missing
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test('blog without title is not added and returns 400', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 10,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, initialBlogs.length);
});

test('blog without url is not added and returns 400', async () => {
  const newBlog = {
    title: 'Test Blog Without URL',
    author: 'Test Author',
    likes: 10,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});
