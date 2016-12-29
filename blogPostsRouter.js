const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// Creating some blogs to have data to work with
BlogPosts.create(
	'How to Create an API', 'In this artice....', 'Steve Brown', '12/27/2016'
	);
BlogPosts.create(
	'First Blog', 'This is my first blog....', 'Steve Brown', '12/6/2016');

// send back JSON of all posts
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(post);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id (${req.body.id}) must match)`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedPost = BlogPosts.update(
    {
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    });
  console.log(updatedPost);
  res.status(204).json(updatedPost);
});

router.delete('/:id', jsonParser, (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleting post \`${req.params.id}\``);
  res.status(204).end();
});

module.exports = router;
