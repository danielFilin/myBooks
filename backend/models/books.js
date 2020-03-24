const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {type: String, required: true},
  description: {type: String, required: true},
  imagePath: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Book', bookSchema);
