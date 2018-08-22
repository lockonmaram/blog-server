var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
const User = require('../models/user')
const mongoose = require('mongoose')
let testUserId
chai.should();
chai.use(chaiHttp);

let url = 'http://localhost:3000'
// let url = 'https://blogserver.lockonmaram.com'

describe('User', function(){
  before((done) => {
    this.timeout(5000)
    mongoose.connect(process.env.MONGO_URI_DEVELOPMENT, { useNewUrlParser: true })
    .then (function () {
      User.deleteMany({ last_name: 'test'})
      .then ( function (result) {
        console.log("user deleted");
        done()
      })
      .catch (function (err) {
        done()
      })
    })
  })
  it('should add a SINGLE user on /signup POST', function(done){
      chai.request(url)
        .post('/signup')
        .send({
          first_name: 'signup',
          last_name: 'test',
          email: 'signuptest@gmail.com',
          password: 'eueu123',
        })
        .end(function(err, res){
          // console.log('signup',res.body);
          res.body.should.be.a('object')
          res.body.data.should.have.property('first_name')
          res.body.data.should.have.property('last_name')
          res.body.data.should.have.property('email')
          res.body.data.should.have.property('password')
          res.should.have.status(200)
          done()
        })
  })
  it('should show a SINGLE user login token on /login POST', function(done){
    chai.request(url)
        .post('/login')
        .send({
          email: 'signuptest@gmail.com',
          password: 'eueu123'
        })
        .end(function(err, res){
          // console.log(res.body);
          res.body.token.should.be.a('string')
          res.should.have.status(200)
          done()
        })
  })
  it('should add a SINGLE user on /users POST', function(done){
    chai.request(url)
    .post('/users')
    .send({
      first_name: 'users',
      last_name: 'test',
      email: 'userstest@gmail.com',
      password: 'eueu123',
    })
    .end(function(err, res){
      // console.log('users',res.body);
      testUserId = res.body.data._id
      // console.log(testUserId);
      res.body.should.be.a('object')
      res.body.data.should.have.property('first_name')
      res.body.data.should.have.property('last_name')
      res.body.data.should.have.property('email')
      res.body.data.should.have.property('password')
      res.should.have.status(200)
      done()
    })
  })
  it('should show ALL users on /users GET', function(done){
    chai.request(url)
    .get('/users')
    .end(function(err, res){
      // console.log('signup',res.body);
      res.body.should.be.a('object')
      res.body.data.should.be.a('array')
      res.should.have.status(200)
      done()
    })
  })
  it('should update a SINGLE user on /users/:id PUT', function(done){
    chai.request(url)
    .put(`/users/${testUserId}`)
    .send({
      first_name: 'update',
      last_name: 'test',
      email: 'userstest@gmail.com',
      password: 'eueu123',
    })
    .end(function(err, res){
      // console.log('users',res.body);
      // console.log(testUserId);
      res.body.should.be.a('object')
      res.body.result.should.be.a('object')
      res.body.result.n.should.equal(1)
      res.should.have.status(200)
      done()
    })
  })
  it('should show SINGLE users on /users/:id GET', function(done){
    chai.request(url)
    .get(`/users/${testUserId}`)
    .end(function(err, res){
      // console.log('signup',res.body);
      res.body.should.be.a('object')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('first_name')
      res.body.data.should.have.property('last_name')
      res.body.data.should.have.property('email')
      res.body.data.should.have.property('password')
      res.should.have.status(200)
      done()
    })
  })
  it('should delete a SINGLE user on /users/:id DELETE', function(done){
    chai.request(url)
    .delete(`/users/${testUserId}`)
    .end(function(err, res){
      // console.log(res.body);
      res.body.should.be.a('object')
      res.body.should.have.property('message')
      res.should.have.status(200)
      done()
    })
  })
})
