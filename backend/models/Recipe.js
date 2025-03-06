// Saves the recipe data in the database
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  spoonacularId: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String },
  usedIngredients: { type: Array },
  missedIngredients: { type: Array },
  likes: { type: Number },
  details: { type: Object }, // store full recipe information if needed
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
