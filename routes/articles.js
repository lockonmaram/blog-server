var express = require('express');
var router = express.Router();
var ArticleController = require('../controllers/articlesController')
const WritterCheck = require('../middlewares/writterCheck')
const IsLoggedIn = require('../middlewares/isLoggedIn')

/* GET articles listing. */
router.get('/', ArticleController.getArticles)
router.post('/', IsLoggedIn.loginCheck, ArticleController.addArticle)
router.get('/:id', ArticleController.getOneArticle)
router.delete('/:id', IsLoggedIn.loginCheck, WritterCheck.writterCheck, ArticleController.deleteArticle)
router.put('/:id', IsLoggedIn.loginCheck, WritterCheck.writterCheck, ArticleController.updateArticle)
router.post('/:id/comment', IsLoggedIn.loginCheck, ArticleController.addComment)

module.exports = router;
