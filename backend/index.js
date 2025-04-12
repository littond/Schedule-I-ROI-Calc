import express from 'express';
import cors from 'cors';
import { ingredients } from './ingredients.js';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend (ESM)!' });
});

app.get('/api/ingredients', (req, res) => {
    res.json({ ingredients: Object.keys(ingredients) });
});

/**
 * Calculates the total cost of a recipe.
 * @param {string[]} recipe - An ordered array of ingredient names.
 * @returns {number} The total cost calculated based on the ingredient prices.
 */
const costCalc = (recipe) => {
    return recipe.reduce((acc, item) => {
        // For each ingredient, add its price if it exists in the ingredients object.
        const itemCost = ingredients[item] ?? 0;
        return acc + itemCost;
    }, 0);
};

app.post('/api/recipe', (req, res) => {
    console.log(req.body);
    const { recipe, price } = req.body;
    console.log(recipe, price);

    if (!recipe || !price) {
        return res.status(400).json({ error: 'Missing recipe and/or price' });
    }

    const cost = costCalc(recipe);
    const roi = price - cost;

    res.json({ roi });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
