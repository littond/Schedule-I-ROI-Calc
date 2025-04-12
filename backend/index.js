import express from 'express';
import cors from 'cors';
import { ingredients } from './ingredients.js';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend (ESM)!' });
});

app.get('/api/ingredients', (req, res) => {
    res.json({ ingredients: Object.keys(ingredients) });

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
