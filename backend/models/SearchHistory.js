const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  ingredients: [{
    type: String,
    required: false
  }],
  image: {
    type: String,
    required: false
  },
  searchDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);