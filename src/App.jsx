import { useState, useEffect } from 'react';
import Survey from './components/Survey.jsx';
import MealPlan from './components/MealPlan.jsx';
import ThemePicker, { THEMES, getTheme } from './components/ThemePicker.jsx';
import recipes from './data/recipes.json';
import { filterRecipes, selectMeals, swapMeal } from './utils/matcher.js';

const STORAGE_KEY = 'mise_saved_plan';
const THEME_KEY   = 'mise_theme';

function Landing({ onStart, hasSavedPlan, onLoadSaved }) {
  return (
    <div className="landing">
      <div className="landing-inner">

        <div className="landing-hero-emoji" aria-hidden="true">
          🥗 🍳 🐟 🫘 🥦
        </div>

        <div className="landing-eyebrow">✨ Friction-Free Nutrition</div>
        <h1 className="landing-title">
          Stop deciding what<br />to eat every day.
        </h1>
        <p className="landing-body">
          Plan once a week, eat well all week. One short survey → a personalized
          meal plan → a ready-to-use grocery list. No daily logging. No decision
          fatigue at 7pm.
        </p>

        <div className="landing-cta-row">
          <button className="cta-primary" onClick={onStart}>
            Build my week →
          </button>
          {hasSavedPlan && (
            <button className="cta-secondary" onClick={onLoadSaved}>
              📋 Load last plan
            </button>
          )}
        </div>

        <div className="landing-pillars">
          <div className="pillar">
            <span className="pillar-emoji">💬</span>
            <h3>5 questions</h3>
            <p>Goal, diet, time, meals, budget — takes under 60 seconds.</p>
          </div>
          <div className="pillar">
            <span className="pillar-emoji">🎯</span>
            <h3>Matched meals</h3>
            <p>45 hand-tagged recipes filtered exactly to your preferences.</p>
          </div>
          <div className="pillar">
            <span className="pillar-emoji">🛒</span>
            <h3>One list</h3>
            <p>Ingredients merged and grouped by store aisle. Done.</p>
          </div>
        </div>

        <div className="landing-science-note">
          🧠 Grounded in behavioral science — precommitment, friction reduction, and ego depletion theory.
        </div>
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
    () => localStorage.getItem(THEME_KEY) ?? 'lavender'
  );

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

  const theme = getTheme(themeId);

  const themeVars = {
    '--bg-gradient': theme.bg,
    '--accent':      theme.accent,
    '--accent-bg':   theme.accentBg,
    '--accent-dim':  theme.accentDim,
  };

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
        <div style={{ fontSize: '3rem' }}>😔</div>
        <h2>No recipes matched</h2>
        <p>Try loosening your cooking time or dietary restriction.</p>
        <button className="cta-primary" onClick={() => setPhase('survey')}>
          Try again
        </button>
      </div>
    );
  })();

  return (
    <div className="app-wrapper" style={themeVars}>
      {content}
      <ThemePicker currentTheme={themeId} onChange={handleThemeChange} />
    </div>
  );
}
