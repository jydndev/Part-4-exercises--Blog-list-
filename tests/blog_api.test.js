const { test, after } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('blogs returned as json', async () => {
  api
    .get('/api/blogs')
    .expect(200)
    .expect('Contet-Type', /applicatoin\/json/);

  after(async () => {
    await mongoose.connection.close();
  });
});
