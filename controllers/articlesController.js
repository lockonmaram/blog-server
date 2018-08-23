const Article = require('../models/article')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')

class ArticleController {
  static addArticle(req, res){
    // console.log('asdasdasdasd', req.headers);
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    // console.log('asdfasdfasdfcweqf', decoded);
    Article.create({
      imageUrl: req.body.imageUrl,
      title: req.body.title,
      content: req.body.content,
      writter: decoded.id
    })
    .then(article=>{
      res.status(200).json({message: 'article successfully added!', data: article})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getArticles(req, res){
    Article.find({})
    .populate('comment')
    .populate('writter')
    .then(articles=>{
      res.status(200).json({message: 'articles successfully retrieved', data: articles})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getArticlesByUser(req, res){
    Article.find({ writter: req.params.userId })
    .populate('comment')
    .populate('writter')
    .then(articles=>{
      res.status(200).json({message: 'articles successfully retrieved', data: articles})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getOneArticle(req, res){
    Article.findOne({ _id: req.params.id })
    .populate('comment')
    .populate('writter')
    .then(article=>{
      res.status(200).json({message: 'article successfully retrieved', data: article})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static deleteArticle(req, res){
    Article.deleteOne({ _id: req.params.id })
    .then(result=>{
      // console.log(result.n);
      if (result.n === 0) {
        res.status(404).json({message: 'article not found'})
      }
      res.status(200).json({message: 'article successfully deleted', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static updateArticle(req, res){
    Article.updateOne({ _id: req.params.id },{
      title: req.body.title,
      content: req.body.content
    })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'article not found'})
      }
      res.status(200).json({message: 'article successfully updated', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static addComment(req, res){
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    Comment.create({
      comment: req.body.comment,
      articleId: req.params.id,
      userId: decoded.id
    })
    .then(comment=>{
      // console.log(comment);
      Article.findOneAndUpdate({ _id: req.params.id }, {$push: {comment: comment}})
      .then(result=>{
        // console.log(result);
        res.status(200).json({message: 'comment successfully added!', data: result})
      })
      .catch(err=>{
        res.status(400).json({message:'something went wrong!', err})
      })
    })
    .catch(err=>{
      res.status(400).json({message:'something went wrong!', err})
    })
  }
}

module.exports = ArticleController
