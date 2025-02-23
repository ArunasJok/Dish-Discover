//A placeholder for AI service
// @param {Array} userIngredients - An array of ingredients provided by the user
// @returns {Array} An array of recipes generated by the AI service

const getAIRecommendations = async (userIngredients) => {
    // Dummy recommendation logic: Just echo back the user ingredients with a dummy recipe name
    return userIngredients.map((ingredient, index) => ({
        id: index + 1,
        recipeName: `AI Recommended Dish with ${ingredient}`,
        ingredients: [ingredient, 'salt', 'pepper'],
        recommendationScore: Math.floor(Math.random() * 100),
    }));
};

module.exports = {
    getAIRecommendations,
};