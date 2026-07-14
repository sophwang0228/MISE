import RecipeCard from './RecipeCard.jsx';
import GroceryList from './GroceryList.jsx';
import { mergeIngredients } from '../utils/groceryMerger.js';
import { useState } from 'react';

const GOAL_LABELS = {
  lose_weight:    '⚡ Weight Loss',
  muscle_gain:    '💪 Muscle Gain',
  general_health: '🥗 Eat Healthier',
  maintain:       '⚖️ Maintenance',
};

const DIET_LABELS = {
  none:        'All foods',
  vegetarian:  '🌿 Vegetarian',
  vegan:       '🌱 Vegan',
  dairy_free:  '🥛 Dairy-Free',
  gluten_free: '🌾 Gluten-Free',
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getDayLabel(index, total) {
  if (total <= 7) return DAYS[index % 7];
  const dayIndex = Math.floor(index / 2);
  const slot = index % 2 === 0 ? 'Lunch' : 'Dinner';
  return `${DAYS[dayIndex % 7]} ${slot}`;
}

export default function MealPlan({ plan, preferences, onSwap, onReset }) {
  const [activeTab, setActiveTab] = useState('meals');
  const groceryCategories = mergeIngredients(plan);
  const totalGroceryItems = groceryCategories.reduce((n, c) => n + c.items.length, 0);
  const totalCookTime = plan.reduce((sum, r) => sum + r.time_minutes, 0);
  const uniqueProteins = new Set(plan.map((r) => r.proteinType)).size;

  return (
    <div className="plan-shell">

      {/* Header */}
      <header className="plan-header">
        <div className="plan-logo">MISE</div>
        <button className="reset-btn" onClick={onReset}>← Start over</button>
      </header>

      {/* Hero banner */}
      <section className="hero-banner">
        <div className="hero-inner">
          <div className="hero-text">
            <h2 className="hero-title">Your week is ready ✨</h2>
            <p className="hero-sub">
              {plan.length} meals planned · {totalCookTime} min total cook time ·{' '}
              {uniqueProteins} protein varieties
            </p>
          </div>
          <div className="hero-chips">
            <span className="hero-chip accent-chip">{GOAL_LABELS[preferences.goal]}</span>
            <span className="hero-chip">{DIET_LABELS[preferences.diet]}</span>
            <span className="hero-chip">🛒 {totalGroceryItems} ingredients</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          🍽️ Meal Plan
        </button>
        <button
          className={`tab-btn ${activeTab === 'grocery' ? 'active' : ''}`}
          onClick={() => setActiveTab('grocery')}
        >
          🛒 Grocery List
          <span className="grocery-count">{totalGroceryItems}</span>
        </button>
      </div>

      {/* Content */}
      <main className="plan-content">
        {activeTab === 'meals' ? (
          <div className="meals-grid">
            {plan.map((recipe, i) => (
              <RecipeCard
                key={`${recipe.id}-${i}`}
                recipe={recipe}
                dayLabel={getDayLabel(i, plan.length)}
                mealIndex={i}
                onSwap={onSwap}
              />
            ))}
          </div>
        ) : (
          <GroceryList categories={groceryCategories} />
        )}
      </main>

      {/* Why this works */}
      <aside className="cogsci-panel">
        <h3 className="cogsci-title">Why this approach works</h3>
        <div className="cogsci-grid">
          <div className="cogsci-card">
            <span className="cogsci-icon">🧠</span>
            <h4>Ego Depletion</h4>
            <p>Willpower is a depletable resource (Baumeister, 1998). Deciding what to eat when you're tired and hungry is the worst possible time — so we move that decision to earlier in the week.</p>
          </div>
          <div className="cogsci-card">
            <span className="cogsci-icon">🛤️</span>
            <h4>Friction Reduction</h4>
            <p>Reducing the effort required to act is more powerful than increasing motivation. A ready-made grocery list removes the highest-friction step between intention and healthy eating.</p>
          </div>
          <div className="cogsci-card">
            <span className="cogsci-icon">🔒</span>
            <h4>Precommitment</h4>
            <p>Planning your meals in advance locks in a good decision before temptation can override it. Ulysses tied himself to the mast — you planned Tuesday's dinner.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
