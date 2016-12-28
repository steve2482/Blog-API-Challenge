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
  res.json(BlogPosts.get);
});

router.post('/', (req, res) => {
  // check for required blog post fields in body of request
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.authur);
  res.status(201).json(post);
});

module.exports = router;
