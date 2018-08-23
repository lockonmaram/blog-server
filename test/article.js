var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
const Article = require('../models/article')
const mongoose = require('mongoose')
let testArticleId
chai.should();
chai.use(chaiHttp);

let url = 'http://localhost:3000'
// let url = 'https://blogserver.lockonmaram.com'

describe('Article', function(){
  before((done) => {
    this.timeout(5000)
    mongoose.connect(process.env.MONGO_URI_TEST, { useNewUrlParser: true })
    .then (function () {
      Article.deleteMany({ title: 'test title'})
      .then ( function (result) {
        console.log("article deleted");
        done()
      })
      .catch (function (err) {
        done()
      })
    })
  })
  it('should add a SINGLE article on /articles POST', function(done){
    chai.request(url)
    .post('/articles')
    .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViN2Q1ODllNWZiMzE3NDFmOGNlYjY3MiIsImZpcnN0X25hbWUiOiJtYXJhbSIsImxhc3RfbmFtZSI6InN0cmF0b3MiLCJlbWFpbCI6Im1hcmFtc3RyYXRvc0BnbWFpbC5jb20iLCJpYXQiOjE1MzQ5NDQwMzd9.0ShZWavEtPDjoLJenwiMmOarxX2nr0cDF2ZOW6wGgrY')
    .send({
      imageUrl: 'https://storage.googleapis.com/blog.lockonmaram.com/1534951997024catdog.jpg',
      title: 'test title',
      content: 'this is a psa this is only a test'
    })
    .end(function(err, res){
      // console.log('articles',res.body);
      testArticleId = res.body.data._id
      // console.log(testArticleId);
      res.body.should.be.a('object')
      res.body.data.should.have.property('imageUrl')
      res.body.data.should.have.property('title')
      res.body.data.should.have.property('content')
      res.body.data.should.have.property('writter')
      res.should.have.status(200)
      done()
    })
  })
  it('should show ALL articles on /articles GET', function(done){
    chai.request(url)
    .get('/articles')
    .end(function(err, res){
      // console.log('signup',res.body);
      res.body.should.be.a('object')
      res.body.data.should.be.a('array')
      res.should.have.status(200)
      done()
    })
  })
  it('should update a SINGLE article on /articles/:id PUT', function(done){
    chai.request(url)
    .put(`/articles/${testArticleId}`)
    .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViN2Q1ODllNWZiMzE3NDFmOGNlYjY3MiIsImZpcnN0X25hbWUiOiJtYXJhbSIsImxhc3RfbmFtZSI6InN0cmF0b3MiLCJlbWFpbCI6Im1hcmFtc3RyYXRvc0BnbWFpbC5jb20iLCJpYXQiOjE1MzQ5NDQwMzd9.0ShZWavEtPDjoLJenwiMmOarxX2nr0cDF2ZOW6wGgrY')
    .send({
      title: 'test title',
      content: 'update',
    })
    .end(function(err, res){
      // console.log('articles',res.body);
      // console.log(testArticleId);
      res.body.should.be.a('object')
      res.body.result.should.be.a('object')
      res.body.result.n.should.equal(1)
      res.should.have.status(200)
      done()
    })
  })
  it('should show SINGLE articles on /articles/:id GET', function(done){
    chai.request(url)
    .get(`/articles/${testArticleId}`)
    .end(function(err, res){
      // console.log('signup',res.body);
      res.body.should.be.a('object')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('imageUrl')
      res.body.data.should.have.property('title')
      res.body.data.should.have.property('content')
      res.body.data.should.have.property('writter')
      res.should.have.status(200)
      done()
    })
  })
  it('should add a SINGLE comment and add comment id to article on /articles/:id/comment POST', function(done){
    chai.request(url)
    .post(`/articles/${testArticleId}/comment`)
    .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViN2Q1ODllNWZiMzE3NDFmOGNlYjY3MiIsImZpcnN0X25hbWUiOiJtYXJhbSIsImxhc3RfbmFtZSI6InN0cmF0b3MiLCJlbWFpbCI6Im1hcmFtc3RyYXRvc0BnbWFpbC5jb20iLCJpYXQiOjE1MzQ5NDQwMzd9.0ShZWavEtPDjoLJenwiMmOarxX2nr0cDF2ZOW6wGgrY')
    .send({
      comment: 'test comment'
    })
    .end(function(err, res){
      // console.log('articles-------------',res.body.data);
      // console.log(testArticleId);
      res.body.should.be.a('object')
      res.body.data.should.have.property('comment')
      res.body.data.comment.should.be.a('array')
      res.should.have.status(200)
      done()
    })
  })
  it('should delete a SINGLE article on /articles/:id DELETE', function(done){
    chai.request(url)
    .delete(`/articles/${testArticleId}`)
    .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViN2Q1ODllNWZiMzE3NDFmOGNlYjY3MiIsImZpcnN0X25hbWUiOiJtYXJhbSIsImxhc3RfbmFtZSI6InN0cmF0b3MiLCJlbWFpbCI6Im1hcmFtc3RyYXRvc0BnbWFpbC5jb20iLCJpYXQiOjE1MzQ5NDQwMzd9.0ShZWavEtPDjoLJenwiMmOarxX2nr0cDF2ZOW6wGgrY')
    .end(function(err, res){
      // console.log(res.body);
      res.body.should.be.a('object')
      res.body.should.have.property('message')
      res.body.result.n.should.equal(1)
      res.should.have.status(200)
      done()
    })
  })
})
