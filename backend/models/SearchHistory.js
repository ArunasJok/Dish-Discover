// Stores individual search history for a user
const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  searchTitle: { type: String, required: true },
  searchDate: { type: Date, default: Date.now },
  popularIngredients: [String] // For example, ingredients that were most frequently used in that search
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
