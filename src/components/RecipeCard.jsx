import { useState } from 'react';

const PROTEIN_EMOJIS = {
  poultry: '🍗',
  beef:    '🥩',
  seafood: '🐟',
  eggs:    '🥚',
  legumes: '🫘',
  plant:   '🥦',
  dairy:   '🧀',
};

const PROTEIN_COLORS = {
  poultry: '#f59e0b',
  beef:    '#ef4444',
  seafood: '#3b82f6',
  eggs:    '#eab308',
  legumes: '#22c55e',
  plant:   '#10b981',
  dairy:   '#a78bfa',
};

export default function RecipeCard({ recipe, dayLabel, mealIndex, onSwap }) {
  const [expanded, setExpanded] = useState(false);
  const proteinColor = PROTEIN_COLORS[recipe.proteinType] ?? '#888';
  const proteinEmoji = PROTEIN_EMOJIS[recipe.proteinType] ?? '🍴';
  const budgetLabel = { low: '$', medium: '$$', high: '$$$' }[recipe.budget] ?? '$$';

  function formatTime(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }

  return (
    <article className="recipe-card">

      {/* Day label */}
      <div className="card-day-label">{dayLabel}</div>

      {/* Big emoji + name */}
      <div className="card-hero">
        <span className="card-hero-emoji">{proteinEmoji}</span>
        <h3 className="recipe-name">{recipe.name}</h3>
      </div>

      {/* Quick meta row */}
      <div className="card-meta-row">
        <span
          className="protein-badge"
          style={{ background: proteinColor + '22', color: proteinColor, borderColor: proteinColor + '44' }}
        >
          {recipe.proteinType}
        </span>
        <span className="meta-pill">⏱ {formatTime(recipe.time_minutes)}</span>
        <span className="meta-pill">{budgetLabel}</span>
      </div>

      {/* Action buttons */}
      <div className="card-actions">
        <button
          className="expand-btn"
          onClick={() => setExpanded((x) => !x)}
          aria-expanded={expanded}
        >
          {expanded ? '▲ Hide details' : '▼ See recipe'}
        </button>
        <button className="swap-btn" onClick={() => onSwap(mealIndex)}>
          ↺ Swap meal
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="recipe-details">
          <div className="ingredients-mini">
            <h4>🧾 Ingredients</h4>
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
            <h4>👨‍🍳 Method</h4>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      )}
    </article>
  );
}
