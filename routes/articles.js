var express = require('express');
var router = express.Router();
var ArticleController = require('../controllers/articlesController')
const WritterCheck = require('../middlewares/writterCheck')
const CommentCheck = require('../middlewares/commentCheck')
const IsLoggedIn = require('../middlewares/isLoggedIn')
const images = require('../helpers/images')


/* GET articles listing. */
router.get('/', ArticleController.getArticles)
router.get('/user/:userId', ArticleController.getArticles)
router.post('/', IsLoggedIn.loginCheck, ArticleController.addArticle)
router.get('/:id', ArticleController.getOneArticle)
router.delete('/:id', IsLoggedIn.loginCheck, WritterCheck.writterCheck, ArticleController.deleteArticle)
router.put('/:id', IsLoggedIn.loginCheck, WritterCheck.writterCheck, ArticleController.updateArticle)
router.post('/:id/comment', IsLoggedIn.loginCheck, ArticleController.addComment)
router.delete('/:id/comment/:commentId', IsLoggedIn.loginCheck, CommentCheck.writterCheck, ArticleController.deleteComment)
router.post('/upload',
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res) => {
    res.send({
      status: 200,
      message: 'Your file is successfully uploaded',
      link: req.file.cloudStoragePublicUrl
    })
  })

module.exports = router;
