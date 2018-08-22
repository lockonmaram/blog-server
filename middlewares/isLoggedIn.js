const jwt = require('jsonwebtoken')
require('dotenv').config()

class LoginCheck {
  static loginCheck (req, res, next){
    // console.log(req.headers);
    jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, function(err,decoded){
      console.log(decoded);
      if (decoded === undefined) {
        res.status(400).json({message: 'not logged in'})
      }
      next()
    })
  }
}

module.exports = LoginCheck
