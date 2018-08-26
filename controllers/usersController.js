const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var FB = require('fb')
const nodeMailer = require('nodemailer')

class UserController {
  static registerUser(req, res){
    // console.log(req.body);
    if (req.body.password === undefined || req.body.password.length === 0) {
      res.status(400).json({message: 'password is required'})
    }
    const saltUser = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, saltUser)
    User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: hashedPassword
    })
    .then(user=>{
      let transporter = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
          user:'treasurecredit@gmail.com',
          pass:'pairproject'
        }
      })
      // console.log(transporter);
      // console.log(user.email);
      let mailOptions = {
        from:'"Maram Blog"<treasurecredit@gmail.com>',
        to: user.email,
        subject: 'Register successful!',
        html: `<b> Thank you ${user.first_name},<br>
                   for joining Maram Blog!<br><br>
                   Now you can post and comment!
              </b>`
      };
      // console.log(mailOptions);
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          res.status(400).json(error)
        }
        // res.alert('account registration confirmation has been sent via email!')
        // console.log('Message %s sent: %s',info.messageId,info.response);
        res.status(200).json({message: 'user successfully registered!', data: user})
      })
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getUsers(req, res){
    User.find({})
    .then(users=>{
      // console.log(users);
      if (users.length === 0) {
        res.status(404).json({message: 'no users found!',data: users})
      }else {
        res.status(200).json({message: 'users found!',data: users})
      }
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getOneUser(req, res){
    User.findOne({ _id: req.params.id })
    .then(user=>{
      // console.log(user);
      res.status(200).json({message: 'User successfully retrived',data: user})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static deleteUser(req, res){
    User.deleteOne({ _id: req.params.id })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'user not found!'})
      }
      res.status(200).json({message: 'user successfully deleted', data: result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static updateUser(req, res){
    if (req.body.password === undefined || req.body.password.length === 0) {
      res.status(400).json({message: 'password is required to update'})
    }
    const saltUser = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, saltUser)
    User.updateOne({ _id: req.params.id }, {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'user not found'})
      }
      res.status(200).json({message: 'user successfully updated!', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static login(req, res){
    // console.log(req.body)/;
    User.findOne({ email: req.body.email})
    .then(user => {
      const passwordCheck = bcrypt.compareSync(req.body.password, user.password)
      // console.log(user.password);
      // console.log(passwordCheck);
      if (passwordCheck) {
        const tokenUser = jwt.sign({
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        }, process.env.JWT_SECRET_KEY)
        // console.log(tokenUser);
        res.status(200).json({message: 'login successful!', token: tokenUser})
        // req.headers.token = tokenUser
      }else {
        res.status(400).json({message: 'wrong password'})
      }
    })
    .catch(err=>{
      res.status(400).json({message: 'email is not found'})
    })
  }
}

module.exports = UserController
