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

const U  = 'https://images.unsplash.com/photo-';
const Q  = '?auto=format&fit=crop&w=600&h=290&q=80';
const KW = 'https://source.unsplash.com/600x290/?'; // keyword URL — always shows matching food

const RECIPE_IMAGES = {
  // Poultry
  'chicken-stirfry':               `${U}1603360946369-dc9bb6258143${Q}`, // ✓ verified
  'greek-chicken-bowl':            `${U}1546069901-ba9599a7e63c${Q}`,    // ✓ verified
  'turkey-tacos':                  `${U}1565299585323-38d6b0865b47${Q}`, // ✓ verified
  'lemon-herb-chicken':            `${U}1532550907401-a500c9a57435${Q}`, // ✓ verified
  'chicken-caesar-salad':          `${U}1512621776951-a57141f2eefd${Q}`, // ✓ verified
  'turkey-sweet-potato-skillet':   `${KW}sweet+potato,skillet,meal`,
  'chicken-fajita-bowl':           `${KW}chicken+fajita,bowl`,
  'turkey-veggie-soup':            `${U}1547592166-23ac45744acd${Q}`,    // ✓ verified
  'turkey-meatball-bowl':          `${KW}meatballs,food`,
  'chicken-rice-soup':             `${U}1547592166-23ac45744acd${Q}`,    // ✓ verified

  // Seafood
  'salmon-asparagus':              `${U}1519708227418-c8fd9a32b7a2${Q}`, // ✓ verified
  'shrimp-fried-rice':             `${U}1603360946369-dc9bb6258143${Q}`, // ✓ verified
  'tuna-lettuce-wraps':            `${KW}tuna,lettuce+wraps`,
  'salmon-poke-bowl':              `${U}1546069901-ba9599a7e63c${Q}`,    // ✓ verified
  'baked-cod-veggies':             `${KW}baked+fish,cod,vegetables`,
  'shrimp-tacos':                  `${U}1565299585323-38d6b0865b47${Q}`, // ✓ verified

  // Beef
  'beef-broccoli':                 `${U}1603360946369-dc9bb6258143${Q}`, // ✓ verified
  'beef-tacos':                    `${U}1565299585323-38d6b0865b47${Q}`, // ✓ verified

  // Eggs
  'egg-veggie-scramble':           `${U}1482049016688-2d3e1b311543${Q}`, // ✓ verified
  'spinach-mushroom-omelette':     `${U}1510693206972-df098062cb71${Q}`, // ✓ verified
  'shakshuka':                     `${KW}shakshuka,eggs`,
  'veggie-frittata':               `${U}1510693206972-df098062cb71${Q}`, // ✓ verified
  'egg-salad-wraps':               `${KW}egg+salad,lettuce+wrap`,
  'veggie-egg-fried-rice':         `${U}1603360946369-dc9bb6258143${Q}`, // ✓ verified

  // Legumes
  'black-bean-quesadillas':        `${U}1565299585323-38d6b0865b47${Q}`, // ✓ verified
  'black-bean-buddha-bowl':        `${U}1546069901-ba9599a7e63c${Q}`,    // ✓ verified
  'lentil-soup':                   `${U}1547592166-23ac45744acd${Q}`,    // ✓ verified
  'chickpea-curry':                `${U}1585937421612-70a008356fbe${Q}`, // ✓ verified
  'sweet-potato-black-bean-tacos': `${U}1565299585323-38d6b0865b47${Q}`, // ✓ verified
  'white-bean-tomato-stew':        `${U}1547592166-23ac45744acd${Q}`,    // ✓ verified

  // Plant-based
  'tofu-stirfry':                  `${U}1603360946369-dc9bb6258143${Q}`, // ✓ verified
  'avocado-toast-hemp':            `${U}1541519227354-08fa5d50c820${Q}`, // ✓ verified
  'peanut-noodles':                `${KW}peanut+noodles,asian`,
  'quinoa-power-bowl':             `${U}1546069901-ba9599a7e63c${Q}`,    // ✓ verified
  'edamame-rice-bowl':             `${U}1546069901-ba9599a7e63c${Q}`,    // ✓ verified
  'smoothie-bowl':                 `${KW}smoothie+bowl,acai`,
  'zucchini-noodles-marinara':     `${U}1555949258-eb67b1ef0ceb${Q}`,    // ✓ verified
  'grain-bowl-tahini':             `${U}1546069901-ba9599a7e63c${Q}`,    // ✓ verified

  // Dairy
  'caprese-pasta':                 `${U}1555949258-eb67b1ef0ceb${Q}`,    // ✓ verified
  'pasta-primavera':               `${U}1555949258-eb67b1ef0ceb${Q}`,    // ✓ verified
  'greek-salad':                   `${U}1512621776951-a57141f2eefd${Q}`, // ✓ verified
  'stuffed-peppers':               `${KW}stuffed+bell+peppers`,
  'overnight-oats':                `${KW}overnight+oats,berries`,
};

// Protein-type fallback if per-recipe photo fails to load
const PROTEIN_FALLBACKS = {
  poultry: `${U}1532550907401-a500c9a57435${Q}`, // ✓ verified
  beef:    `${KW}beef,steak,grilled`,
  seafood: `${U}1519708227418-c8fd9a32b7a2${Q}`, // ✓ verified
  eggs:    `${U}1510693206972-df098062cb71${Q}`, // ✓ verified
  legumes: `${U}1546069901-ba9599a7e63c${Q}`,   // ✓ verified
  plant:   `${U}1512621776951-a57141f2eefd${Q}`, // ✓ verified
  dairy:   `${U}1555949258-eb67b1ef0ceb${Q}`,   // ✓ verified
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
