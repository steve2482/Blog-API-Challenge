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
    return chai.request(server)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.atleast(1);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(
            'id', 'title', 'content', 'author', 'publisDate');
        })
      })
  })
})