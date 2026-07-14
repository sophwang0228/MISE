import { useState } from 'react';

const PROTEIN_COLORS = {
  poultry: '#f59e0b',
  beef:    '#ef4444',
  seafood: '#3b82f6',
  eggs:    '#eab308',
  legumes: '#22c55e',
  plant:   '#10b981',
  dairy:   '#8b5cf6',
};

const PROTEIN_ICONS = {
  poultry: '🍗',
  beef:    '🥩',
  seafood: '🐟',
  eggs:    '🥚',
  legumes: '🫘',
  plant:   '🌿',
  dairy:   '🧀',
};

export default function RecipeCard({ recipe, mealNumber, onSwap }) {
  const [expanded, setExpanded] = useState(false);
  const accentColor = PROTEIN_COLORS[recipe.proteinType] ?? '#e8572a';

  function formatTime(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }

  const budgetLabel = { low: '$', medium: '$$', high: '$$$' }[recipe.budget] ?? '$$';

  return (
    <article className="recipe-card" style={{ '--accent': accentColor }}>
      <div className="recipe-card-header">
        <div className="meal-number">Meal {mealNumber}</div>
        <div className="recipe-meta-row">
          <span className="protein-badge" style={{ background: accentColor }}>
            {PROTEIN_ICONS[recipe.proteinType]} {recipe.proteinType}
          </span>
          <span className="time-badge">⏱ {formatTime(recipe.time_minutes)}</span>
          <span className="budget-badge">{budgetLabel}</span>
        </div>
      </div>

      <h3 className="recipe-name">{recipe.name}</h3>

      <div className="recipe-actions">
        <button
          className="expand-btn"
          onClick={() => setExpanded((x) => !x)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide instructions ↑' : 'Show instructions ↓'}
        </button>
        <button className="swap-btn" onClick={() => onSwap(mealNumber - 1)}>
          ↺ Swap
        </button>
      </div>

      {expanded && (
        <div className="recipe-details">
          <div className="ingredients-mini">
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span className="ing-amount">{ing.amount} {ing.unit}</span>
                  <span className="ing-item">{ing.item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="instructions-mini">
            <h4>Method</h4>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      )}
    </article>
  );
}
