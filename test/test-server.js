const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server')

const should = chai.should();

chai.use(chaiHttp);

describe('BlogPosts', function() {

	before(function() {
		return runServer();
	});

  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(
            'id', 'title', 'content', 'author', 'publishDate');
        });
      });
  });

  it('should return a post on POST', function() {
    const newPost = {
      'title': 'New Post',
      'content': 'This is a new post',
      'author': 'Test',
      'publishDate': '1/05/2017'
    }
    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
        res.body.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
      });
  });

  it('should update a post and return the updated post', function() {
    const updatedPost = {
      'title': 'Updated Post',
      'content': 'Updated Content',
    }
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      updatedPost.id = res.body[0].id;
      updatedPost.author = res.body[0].author;
      updatedPost.publishDate = res.body[0].publishDate;
      return chai.request(app)
      .put(`/blog-posts/${updatedPost.id}`)
      .send(updatedPost)
    })
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.deep.equal(updatedPost)
    });
  });
});