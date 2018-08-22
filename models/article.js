var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  imageUrl: {
    type: String,
    required: [true, 'url is required']
  },
  title: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  writter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});


var Article = mongoose.model('Article', articleSchema);

module.exports = Article
