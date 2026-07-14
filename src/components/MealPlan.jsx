import RecipeCard from './RecipeCard.jsx';
import GroceryList from './GroceryList.jsx';
import { mergeIngredients } from '../utils/groceryMerger.js';
import { useState } from 'react';

const GOAL_LABELS = {
  lose_weight:    'Weight Loss',
  muscle_gain:    'Muscle Gain',
  general_health: 'General Health',
  maintain:       'Maintenance',
};

const DIET_LABELS = {
  none:        'No Restrictions',
  vegetarian:  'Vegetarian',
  vegan:       'Vegan',
  dairy_free:  'Dairy-Free',
  gluten_free: 'Gluten-Free',
};

const TIME_LABELS = {
  quick:    'Quick (< 20 min)',
  moderate: 'Moderate (20–40 min)',
  any:      'No Limit',
};

export default function MealPlan({ plan, preferences, onSwap, onReset }) {
  const [activeTab, setActiveTab] = useState('meals');
  const groceryCategories = mergeIngredients(plan);

  // Compute cognitive savings stats
  const decisionsEliminated = plan.length;
  const totalMinutesOfDecisions = plan.length * 8; // avg ~8 min deliberating per meal
  const uniqueProteins = new Set(plan.map((r) => r.proteinType)).size;

  return (
    <div className="plan-shell">
      {/* Top bar */}
      <header className="plan-header">
        <div className="plan-logo">MISE</div>
        <div className="plan-header-right">
          <button className="reset-btn" onClick={onReset}>
            ← New plan
          </button>
        </div>
      </header>

      {/* Cognitive savings banner */}
      <section className="savings-banner">
        <div className="savings-inner">
          <h2 className="savings-headline">Your week is set.</h2>
          <p className="savings-sub">
            You've front-loaded your decision budget so your future self doesn't have to.
          </p>
          <div className="savings-stats">
            <div className="stat-card">
              <span className="stat-number">{decisionsEliminated}</span>
              <span className="stat-label">decisions<br/>eliminated</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-number">{totalMinutesOfDecisions}</span>
              <span className="stat-label">minutes of<br/>decision fatigue saved</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-card">
              <span className="stat-number">{uniqueProteins}</span>
              <span className="stat-label">protein<br/>varieties</span>
            </div>
          </div>
        </div>

        {/* Preference chips */}
        <div className="pref-chips">
          <span className="pref-chip goal-chip">{GOAL_LABELS[preferences.goal]}</span>
          <span className="pref-chip">{DIET_LABELS[preferences.diet]}</span>
          <span className="pref-chip">{TIME_LABELS[preferences.cookingTime]}</span>
          <span className="pref-chip">{plan.length} meals</span>
        </div>
      </section>

      {/* Tab nav */}
      <div className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'meals' ? 'active' : ''}`}
          onClick={() => setActiveTab('meals')}
        >
          Meal Plan
        </button>
        <button
          className={`tab-btn ${activeTab === 'grocery' ? 'active' : ''}`}
          onClick={() => setActiveTab('grocery')}
        >
          Grocery List
          <span className="grocery-count">
            {groceryCategories.reduce((n, c) => n + c.items.length, 0)} items
          </span>
        </button>
      </div>

      {/* Tab content */}
      <main className="plan-content">
        {activeTab === 'meals' ? (
          <div className="meals-grid">
            {plan.map((recipe, i) => (
              <RecipeCard
                key={`${recipe.id}-${i}`}
                recipe={recipe}
                mealNumber={i + 1}
                onSwap={onSwap}
              />
            ))}
          </div>
        ) : (
          <GroceryList categories={groceryCategories} />
        )}
      </main>

      {/* Cog-sci explainer footer */}
      <aside className="cogsci-panel">
        <h3 className="cogsci-title">Why this works</h3>
        <div className="cogsci-grid">
          <div className="cogsci-card">
            <span className="cogsci-icon">🧠</span>
            <h4>Ego Depletion</h4>
            <p>Baumeister (1998) found that willpower is a depletable resource. Making decisions earlier in the week — when your capacity is higher — reduces poor choices when you're tired and hungry.</p>
          </div>
          <div className="cogsci-card">
            <span className="cogsci-icon">⚡</span>
            <h4>Friction Reduction</h4>
            <p>Behavior change research shows that reducing friction (the effort required to act) is more effective than increasing motivation. A pre-built grocery list removes the highest-friction step: figuring out what to buy.</p>
          </div>
          <div className="cogsci-card">
            <span className="cogsci-icon">🔮</span>
            <h4>Precommitment</h4>
            <p>Planning your meals in advance is a precommitment device — you lock in a good decision before temptation or fatigue can override it. Ulysses tied himself to the mast; you planned your Tuesday dinner.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
