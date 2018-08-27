const jwt = require('jsonwebtoken')
const Comment = require('../models/comment')
const Article = require('../models/article')

class Writter {
  static writterCheck (req, res, next){
    jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, function(err,decoded){
      if (decoded === undefined) {
        res.status(402).json({message: 'invalid token'})
      }else {
        console.log('asdfasd2f', decoded.id);
        console.log('asdfasd2f', req.params.commentId);
        Comment.findOne({ _id: req.params.commentId })
        .then(comment=>{
          // console.log('asdfasd1f', comment.writter);
          console.log('user', comment);
          if (comment.userId == decoded.id) {
            next()
          }else {
            Article.findOne({ _id: req.params.id })
            .then(article=>{
              // console.log('asdfasd1f', article.writter);
              // console.log('asdfasd2f', decoded.id);
              if (article.writter == decoded.id) {
                next()
              }else {
                res.status(401).json({message: 'user not authorized'})
              }
            })
            .catch(err=>{
              res.status(403).json({message: 'something went wrong!', err})
            })
          }
        })
        .catch(err=>{
          res.status(403).json({message: 'something went wrong!', err})
        })
      }
    })
  }
}

module.exports = Writter
