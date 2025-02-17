// Controller function to get a list of recipes
exports.getRecipes = async (req, res) => {
    try {
      // For now, we return a dummy array of recipes.
      // Later, I will fetch recipes from your database or external API.
      const recipes = [
        { id: 1, name: 'Pasta Primavera', ingredients: ['pasta', 'tomato', 'basil'] },
        { id: 2, name: 'Caesar Salad', ingredients: ['lettuce', 'croutons', 'parmesan'] },
      ];
      res.json(recipes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  
  // Controller function to create a new recipe
  exports.createRecipe = async (req, res) => {
    try {
      // For now, just echo back the received data.
      // Later, you would save this to your database.
      const newRecipe = req.body;
      res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  