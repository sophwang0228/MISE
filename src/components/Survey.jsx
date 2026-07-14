import { useState, useEffect } from 'react';

const STEPS = [
  {
    id: 'goal',
    question: "What's your primary nutrition goal?",
    insight: "Knowing your goal shapes which macronutrient ratios we prioritize — not as a rigid prescription, but as a compass for recipe selection.",
    options: [
      { value: 'lose_weight',    label: 'Lose Weight',      sub: 'Lower-calorie, filling meals',  icon: '⚡' },
      { value: 'muscle_gain',   label: 'Build Muscle',     sub: 'High-protein, nutrient-dense',   icon: '💪' },
      { value: 'general_health',label: 'Eat Healthier',    sub: 'Balanced, whole-food focus',     icon: '🥗' },
      { value: 'maintain',      label: 'Maintain',         sub: 'Keep things steady',             icon: '⚖️' },
    ],
  },
  {
    id: 'diet',
    question: 'Any dietary restrictions?',
    insight: "We use this to filter the recipe pool — not to limit you, but to ensure every suggestion is something you can actually eat.",
    options: [
      { value: 'none',        label: 'No Restrictions', sub: 'Everything is on the table', icon: '✓' },
      { value: 'vegetarian',  label: 'Vegetarian',      sub: 'No meat or fish',            icon: '🌿' },
      { value: 'vegan',       label: 'Vegan',           sub: 'No animal products',         icon: '🌱' },
      { value: 'dairy_free',  label: 'Dairy-Free',      sub: 'No milk, cheese, or butter', icon: '🥛' },
      { value: 'gluten_free', label: 'Gluten-Free',     sub: 'No wheat or gluten',         icon: '🌾' },
    ],
  },
  {
    id: 'cookingTime',
    question: 'How much time can you spare in the kitchen?',
    insight: "Behavioral research shows that friction is the #1 reason people abandon healthy habits. Lower time = lower friction = higher consistency.",
    options: [
      { value: 'quick',    label: 'Quick',    sub: 'Under 20 minutes',  icon: '⚡' },
      { value: 'moderate', label: 'Moderate', sub: '20 – 40 minutes',   icon: '🕐' },
      { value: 'any',      label: 'Any',      sub: 'I enjoy cooking',   icon: '👨‍🍳' },
    ],
  },
  {
    id: 'mealCount',
    question: 'How many meals should we plan this week?',
    insight: "Planning upfront is a form of precommitment — a well-established decision science technique. The more meals planned, the fewer improvised (and often poor) choices you'll face.",
    options: [
      { value: 5,  label: '5 meals',  sub: 'Weekday lunches or dinners', icon: '🗓' },
      { value: 7,  label: '7 meals',  sub: 'One full week of dinners',   icon: '🗓' },
      { value: 10, label: '10 meals', sub: 'Mix of lunch and dinner',    icon: '🗓' },
      { value: 14, label: '14 meals', sub: 'Two full weeks of meals',    icon: '🗓' },
    ],
  },
  {
    id: 'budget',
    question: "What's your grocery budget?",
    insight: "Cost is a real constraint on habit formation. We'll skew toward recipes that fit your budget tier so that healthy eating stays sustainable.",
    options: [
      { value: 'low',    label: 'Budget-Friendly', sub: 'Under $5 per serving',   icon: '💰' },
      { value: 'medium', label: 'Moderate',         sub: 'Around $5–10 / serving', icon: '💳' },
      { value: 'any',    label: 'No Preference',    sub: 'Cost isn\'t a concern',  icon: '🛒' },
    ],
  },
];

export default function Survey({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState('forward');
  const [animating, setAnimating] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  // Pre-fill selected value from saved answers when navigating
  useEffect(() => {
    setSelectedValue(answers[current.id] ?? null);
  }, [step, current.id, answers]);

  function handleSelect(value) {
    if (animating) return;
    setSelectedValue(value);

    // Short delay so the user sees their selection before advancing
    setTimeout(() => {
      const newAnswers = { ...answers, [current.id]: value };
      setAnswers(newAnswers);

      if (step < STEPS.length - 1) {
        setDirection('forward');
        setAnimating(true);
        setTimeout(() => {
          setStep((s) => s + 1);
          setAnimating(false);
        }, 280);
      } else {
        // Final step completed
        onComplete(newAnswers);
      }
    }, 200);
  }

  function handleBack() {
    if (step === 0 || animating) return;
    setDirection('back');
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setAnimating(false);
    }, 280);
  }

  const animClass = animating
    ? direction === 'forward'
      ? 'slide-out-left'
      : 'slide-out-right'
    : 'slide-in';

  return (
    <div className="survey-shell">
      {/* Header */}
      <div className="survey-header">
        <div className="survey-logo">MISE</div>
        <div className="survey-step-label">
          {step + 1} of {STEPS.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress + (100 / STEPS.length)}%` }} />
      </div>

      {/* Step card */}
      <div className={`survey-card ${animClass}`} key={step}>
        <p className="survey-question-count">Question {step + 1}</p>
        <h2 className="survey-question">{current.question}</h2>

        <div className="options-grid" data-count={current.options.length}>
          {current.options.map((opt) => (
            <button
              key={opt.value}
              className={`option-btn ${selectedValue === opt.value ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              <span className="option-icon">{opt.icon}</span>
              <span className="option-text">
                <span className="option-label">{opt.label}</span>
                <span className="option-sub">{opt.sub}</span>
              </span>
              <span className="option-check">✓</span>
            </button>
          ))}
        </div>

        <div className="survey-insight">
          <span className="insight-pill">Why we ask</span>
          <p>{current.insight}</p>
        </div>
      </div>

      {/* Back navigation */}
      {step > 0 && (
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>
      )}
    </div>
  );
}
