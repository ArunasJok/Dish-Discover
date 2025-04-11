const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  spoonacularId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  extendedIngredients: {
    type: [{
      id: Number,
      name: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      unit: String,
      original: String
    }],
    required: true,
    validate: [arr => arr.length > 0, 'Recipe must have at least one ingredient']
  },
  usedIngredients: Array,
  missedIngredients: Array,
  likes: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);