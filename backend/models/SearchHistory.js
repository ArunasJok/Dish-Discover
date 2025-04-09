const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: Number,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  searchIngredients: {
    type: [String],
    required: true,
    default: []
  },
  ingredients: {
    type: [String],
    default: []
  },
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

// Add validation middleware
searchHistorySchema.pre('save', function(next) {
  // Ensure searchIngredients is an array
  if (!Array.isArray(this.searchIngredients)) {
    this.searchIngredients = [];
  }
  
  // Clean up ingredients - remove empty strings and trim
  this.searchIngredients = this.searchIngredients
    .filter(ing => typeof ing === 'string' && ing.trim())
    .map(ing => ing.trim().toLowerCase());

  next();
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);