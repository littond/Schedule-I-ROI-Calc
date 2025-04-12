import { useEffect, useState } from 'react';

function App() {
  // State for ingredients from the API
  const [availableAddOns, setAvailableAddOns] = useState([]);
  // Other states remain as before
  const [recipeName, setRecipeName] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [price, setPrice] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  // Fetch available add-ons when component mounts
  useEffect(() => {
    fetch('/api/ingredients')
      .then(res => res.json())
      .then(data => {
        if (data.ingredients) {
          setAvailableAddOns(data.ingredients);
        }
      })
      .catch(err => console.error("Error fetching ingredients:", err));
  }, []);

  // Add an add-on (order matters)
  const addAddon = (addon) => {
    setSelectedAddOns((prev) => [...prev, addon]);
  };

  // Remove an add-on based on index
  const removeAddon = (indexToRemove) => {
    setSelectedAddOns((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Clear all input fields in the form
  const clearRecipe = () => {
    setRecipeName('');
    setSelectedAddOns([]);
    setPrice('');
    setError('');
  };

  // Submit the recipe to the backend to get the ROI
  const submitRecipe = async () => {
    if (selectedAddOns.length === 0 || !price || isNaN(price)) {
      setError("Please select at least one add-on and enter a valid price.");
      return;
    }
    setError('');
    const recipeData = {
      recipe: selectedAddOns,
      price: parseFloat(price)
    };

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
      });
      const data = await res.json();
      if (res.ok) {
        // Create a new recipe object (including optional name)
        const newRecipe = {
          name: recipeName,
          addOns: selectedAddOns,
          price: parseFloat(price),
          roi: data.roi
        };
        // Save the new recipe and sort recipes by ROI (highest first)
        setRecipes((prev) => {
          const newList = [...prev, newRecipe];
          newList.sort((a, b) => b.roi - a.roi);
          return newList;
        });
        clearRecipe();
      } else {
        setError(data.error || "Error computing ROI.");
      }
    } catch (err) {
      setError("Error connecting to the backend.");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Recipe Add-Ons & ROI Calculator</h1>

      {/* Recipe Name Input (Optional) */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="recipeName">Recipe Name (Optional): </label>
        <input
          id="recipeName"
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Enter recipe name"
        />
      </div>

      {/* Available Add-Ons Fetched from API */}
      <div>
        <h2>Available Add-Ons</h2>
        {availableAddOns.length > 0 ? (
          <ul>
            {availableAddOns.map((addon, index) => (
              <li key={index}>
                {addon} <button onClick={() => addAddon(addon)}>Add</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading add-ons…</p>
        )}
      </div>

      {/* Selected Add-Ons with remove (x) button */}
      <div>
        <h2>Selected Add-Ons (Order matters)</h2>
        {selectedAddOns.length > 0 ? (
          <ol>
            {selectedAddOns.map((addon, index) => (
              <li key={index}>
                {addon} <button onClick={() => removeAddon(index)}>x</button>
              </li>
            ))}
          </ol>
        ) : (
          <p>No add-ons selected</p>
        )}
      </div>

      {/* Price Input */}
      <div style={{ marginBottom: '1rem' }}>
        <h2>Price</h2>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Submit and Clear Buttons */}
      <button onClick={submitRecipe} style={{ marginRight: '1rem' }}>Calculate ROI</button>
      <button onClick={clearRecipe}>Clear</button>

      {/* Display Saved Recipes Sorted by ROI */}
      <div>
        <h2>Saved Recipes (Sorted by ROI)</h2>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe, idx) => (
              <li key={idx}>
                {recipe.name && (
                  <span>
                    <strong>{recipe.name}:</strong>
                  </span>
                )}
                <span>
                  <strong>Add-Ons:</strong> {recipe.addOns.join(', ')} |{' '}
                </span>
                <span>
                  <strong>Price:</strong> ${recipe.price.toFixed(2)} |{' '}
                </span>
                <span>
                  <strong>ROI:</strong> {recipe.roi}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recipes yet</p>
        )}
      </div>
    </div>
  );
}

export default App;
