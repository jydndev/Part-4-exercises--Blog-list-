const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max));
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const counts = _.countBy(blogs, 'author');

  const authorArray = _.entries(counts).map(([author, blogs]) => ({
    author,
    blogs,
  }));

  return _.maxBy(authorArray, 'blogs');
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const groupedLikes = _(blogs)
    .groupBy('author')
    .map((posts, author) => ({
      author,
      likes: _.sumBy(posts, 'likes'),
    }))
    .maxBy('likes');

  return groupedLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
