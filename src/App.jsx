import { useState, useEffect } from 'react';
import Survey from './components/Survey.jsx';
import MealPlan from './components/MealPlan.jsx';
import ThemePicker, { THEMES } from './components/ThemePicker.jsx';
import recipes from './data/recipes.json';
import { filterRecipes, selectMeals, swapMeal } from './utils/matcher.js';

const STORAGE_KEY = 'mise_saved_plan';
const THEME_KEY   = 'mise_theme';

function getThemeVars(themeId) {
  return THEMES.find((t) => t.id === themeId)?.vars ?? THEMES[0].vars;
}

function Landing({ onStart, hasSavedPlan, onLoadSaved }) {
  return (
    <div className="landing">
      <div className="landing-inner">
        <div className="landing-eyebrow">✨ Friction-Free Nutrition</div>
        <h1 className="landing-title">
          Stop <em>deciding</em> what to eat.<br />
          Start <em>planning</em> it.
        </h1>
        <p className="landing-body">
          Most nutrition apps demand daily logging — exactly when your willpower is
          lowest. MISE flips the model: one short weekly survey, a personalized meal
          plan, and a ready-made grocery list. Front-load the thinking so you never
          have to decide at 7pm on a Tuesday.
        </p>

        <div className="landing-cta-row">
          <button className="cta-primary" onClick={onStart}>
            Build my week's plan →
          </button>
          {hasSavedPlan && (
            <button className="cta-secondary" onClick={onLoadSaved}>
              Load last plan
            </button>
          )}
        </div>

        <div className="landing-pillars">
          <div className="pillar">
            <span className="pillar-num">01</span>
            <h3>Survey</h3>
            <p>5 questions, under 60 seconds. No account needed.</p>
          </div>
          <div className="pillar">
            <span className="pillar-num">02</span>
            <h3>Match</h3>
            <p>Rules-based filtering across 45 hand-tagged recipes.</p>
          </div>
          <div className="pillar">
            <span className="pillar-num">03</span>
            <h3>Shop</h3>
            <p>One deduplicated list, sorted by store section.</p>
          </div>
        </div>

        <footer className="landing-footer">
          Built on behavioral science — no daily logging, no calorie counting, no guilt.
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState('landing');
  const [preferences, setPreferences] = useState(null);
  const [plan, setPlan] = useState([]);
  const [filteredPool, setFilteredPool] = useState([]);
  const [hasSavedPlan, setHasSavedPlan] = useState(false);
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem(THEME_KEY) ?? 'rose'
  );

  const themeVars = getThemeVars(themeId);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHasSavedPlan(true);
  }, []);

  function handleThemeChange(id) {
    setThemeId(id);
    localStorage.setItem(THEME_KEY, id);
  }

  function buildPlan(prefs) {
    const filtered = filterRecipes(recipes, prefs);
    const selected = selectMeals(filtered, prefs.mealCount);
    setFilteredPool(filtered);
    setPlan(selected);
    setPreferences(prefs);
    setPhase('results');
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ prefs, plan: selected }));
  }

  function handleSwap(index) {
    const newPlan = swapMeal(plan, index, filteredPool);
    setPlan(newPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ prefs: preferences, plan: newPlan }));
  }

  function handleReset() {
    setPhase('landing');
    setPlan([]);
    setPreferences(null);
    setFilteredPool([]);
  }

  function handleLoadSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.plan && saved?.prefs) {
        const filtered = filterRecipes(recipes, saved.prefs);
        setFilteredPool(filtered);
        setPlan(saved.plan);
        setPreferences(saved.prefs);
        setPhase('results');
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const content = (() => {
    if (phase === 'landing') {
      return (
        <Landing
          onStart={() => setPhase('survey')}
          hasSavedPlan={hasSavedPlan}
          onLoadSaved={handleLoadSaved}
        />
      );
    }
    if (phase === 'survey') {
      return <Survey onComplete={buildPlan} />;
    }
    if (phase === 'results' && plan.length > 0) {
      return (
        <MealPlan
          plan={plan}
          preferences={preferences}
          onSwap={handleSwap}
          onReset={handleReset}
        />
      );
    }
    return (
      <div className="no-results">
        <h2>No recipes matched 😔</h2>
        <p>Try loosening your cooking time or dietary restrictions.</p>
        <button className="cta-primary" onClick={() => setPhase('survey')}>
          Try again
        </button>
      </div>
    );
  })();

  return (
    <div style={themeVars}>
      {content}
      <ThemePicker currentTheme={themeId} onChange={handleThemeChange} />
    </div>
  );
}
