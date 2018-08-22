var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  comment: {
    type: String,
    require: true
  },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    require: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});


var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment
