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

const U = 'https://images.unsplash.com/photo-';
const Q = '?auto=format&fit=crop&w=600&h=290&q=80';

// Per-recipe accurate photos — Unsplash free CDN (no attribution required for web demos)
const RECIPE_IMAGES = {
  // Poultry
  'chicken-stirfry':              `${U}1603360946369-dc9bb6258143${Q}`, // stir fry wok
  'greek-chicken-bowl':           `${U}1546069901-ba9599a7e63c${Q}`,    // grain / poke bowl
  'turkey-tacos':                 `${U}1565299585323-38d6b0865b47${Q}`, // street tacos
  'lemon-herb-chicken':           `${U}1598103442097-8b74394b95c3${Q}`, // roasted chicken
  'chicken-caesar-salad':         `${U}1512621776951-a57141f2eefd${Q}`, // fresh salad plate
  'turkey-sweet-potato-skillet':  `${U}1547592180-85f173990554${Q}`,    // skillet meal
  'chicken-fajita-bowl':          `${U}1592417817098-8fd3d9eb14a5${Q}`, // Mexican fajita bowl
  'turkey-veggie-soup':           `${U}1547592166-23ac45744acd${Q}`,    // vegetable soup
  'turkey-meatball-bowl':         `${U}1555396273-367ea4eb4db5${Q}`,    // meatballs
  'chicken-rice-soup':            `${U}1547592166-23ac45744acd${Q}`,    // chicken soup

  // Seafood
  'salmon-asparagus':             `${U}1519708227418-c8fd9a32b7a2${Q}`, // pan-seared salmon
  'shrimp-fried-rice':            `${U}1603360946369-dc9bb6258143${Q}`, // fried rice
  'tuna-lettuce-wraps':           `${U}1568901346375-23c9450c58cd${Q}`, // lettuce wraps
  'salmon-poke-bowl':             `${U}1546069901-ba9599a7e63c${Q}`,    // poke bowl
  'baked-cod-veggies':            `${U}1476224203421-74177e451c41${Q}`, // baked fish + veg
  'shrimp-tacos':                 `${U}1565299585323-38d6b0865b47${Q}`, // tacos

  // Beef
  'beef-broccoli':                `${U}1603360946369-dc9bb6258143${Q}`, // beef stir fry
  'beef-tacos':                   `${U}1565299585323-38d6b0865b47${Q}`, // beef tacos

  // Eggs
  'egg-veggie-scramble':          `${U}1482049016688-2d3e1b311543${Q}`, // scrambled eggs
  'spinach-mushroom-omelette':    `${U}1525351484163-7529414f2aff${Q}`, // omelette
  'shakshuka':                    `${U}1614198810543-7b40432be0a0${Q}`, // shakshuka
  'veggie-frittata':              `${U}1525351484163-7529414f2aff${Q}`, // frittata
  'egg-salad-wraps':              `${U}1568901346375-23c9450c58cd${Q}`, // lettuce wraps
  'veggie-egg-fried-rice':        `${U}1603360946369-dc9bb6258143${Q}`, // fried rice

  // Legumes
  'black-bean-quesadillas':       `${U}1565299585323-38d6b0865b47${Q}`, // quesadilla / taco style
  'black-bean-buddha-bowl':       `${U}1512058533999-100141f5c4b8${Q}`, // buddha bowl
  'lentil-soup':                  `${U}1547592166-23ac45744acd${Q}`,    // red lentil soup
  'chickpea-curry':               `${U}1585937421612-70a008356fbe${Q}`, // Indian curry
  'sweet-potato-black-bean-tacos':`${U}1565299585323-38d6b0865b47${Q}`, // veggie tacos
  'white-bean-tomato-stew':       `${U}1547592166-23ac45744acd${Q}`,    // tomato stew

  // Plant-based
  'tofu-stirfry':                 `${U}1603360946369-dc9bb6258143${Q}`, // tofu stir fry
  'avocado-toast-hemp':           `${U}1541519227354-08fa5d50c820${Q}`, // avocado toast
  'peanut-noodles':               `${U}1569050467447-ce54b3bbc37d${Q}`, // Asian noodles
  'quinoa-power-bowl':            `${U}1512058533999-100141f5c4b8${Q}`, // quinoa bowl
  'edamame-rice-bowl':            `${U}1546069901-ba9599a7e63c${Q}`,    // Japanese rice bowl
  'smoothie-bowl':                `${U}1534353436294-0dbd4bdac845${Q}`, // smoothie / acai bowl
  'zucchini-noodles-marinara':    `${U}1555949258-eb67b1ef0ceb${Q}`,    // pasta-style noodles
  'grain-bowl-tahini':            `${U}1512058533999-100141f5c4b8${Q}`, // grain bowl

  // Dairy
  'caprese-pasta':                `${U}1555949258-eb67b1ef0ceb${Q}`,    // pasta
  'pasta-primavera':              `${U}1555949258-eb67b1ef0ceb${Q}`,    // veggie pasta
  'greek-salad':                  `${U}1540189549336-e6e99eb4b14e${Q}`, // Greek salad
  'stuffed-peppers':              `${U}1617347454431-f49d7ff5c3b1${Q}`, // stuffed peppers
  'overnight-oats':               `${U}1484723091739-30a097e8f929${Q}`, // overnight oats
};

// Protein-type fallback if per-recipe photo fails
const PROTEIN_FALLBACKS = {
  poultry: `${U}1598103442097-8b74394b95c3${Q}`,
  beef:    `${U}1529692236671-f1f6cf9683ba${Q}`,
  seafood: `${U}1519708227418-c8fd9a32b7a2${Q}`,
  eggs:    `${U}1482049016688-2d3e1b311543${Q}`,
  legumes: `${U}1546069901-ba9599a7e63c${Q}`,
  plant:   `${U}1512621776951-a57141f2eefd${Q}`,
  dairy:   `${U}1555949258-eb67b1ef0ceb${Q}`,
};

export default function RecipeCard({ recipe, dayLabel, mealIndex, onSwap }) {
  const [expanded, setExpanded] = useState(false);

  const primaryUrl  = RECIPE_IMAGES[recipe.id];
  const fallbackUrl = PROTEIN_FALLBACKS[recipe.proteinType];
  const [imgSrc, setImgSrc]       = useState(primaryUrl ?? fallbackUrl);
  const [showPhoto, setShowPhoto] = useState(true);

  const proteinColor = PROTEIN_COLORS[recipe.proteinType] ?? '#888';
  const proteinEmoji = PROTEIN_EMOJIS[recipe.proteinType] ?? '🍴';
  const budgetLabel  = { low: '$', medium: '$$', high: '$$$' }[recipe.budget] ?? '$$';

  function handleImgError() {
    if (imgSrc !== fallbackUrl && fallbackUrl) {
      setImgSrc(fallbackUrl); // try protein-type fallback
    } else {
      setShowPhoto(false);    // give up → gradient + emoji
    }
  }

  function formatTime(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }

  return (
    <article className="recipe-card">

      <div
        className={`card-image-area${showPhoto ? '' : ' no-photo'}`}
        style={{ background: `linear-gradient(145deg, ${proteinColor}20 0%, ${proteinColor}55 100%)` }}
      >
        {showPhoto && (
          <img
            key={imgSrc}
            src={imgSrc}
            alt={recipe.name}
            className="card-img-photo"
            loading="lazy"
            decoding="async"
            onError={handleImgError}
          />
        )}
        <span className="card-img-emoji">{proteinEmoji}</span>
        <span className="card-img-day-label">{dayLabel}</span>
      </div>

      <div className="card-body">
        <h3 className="recipe-name">{recipe.name}</h3>

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
      </div>
    </article>
  );
}
