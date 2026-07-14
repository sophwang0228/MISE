/**
 * Category display config: label, order, and icon character.
 */
export const CATEGORY_META = {
  produce:  { label: 'Produce',       order: 1, icon: '🥬' },
  protein:  { label: 'Protein',       order: 2, icon: '🥩' },
  dairy:    { label: 'Dairy',         order: 3, icon: '🧀' },
  pantry:   { label: 'Pantry',        order: 4, icon: '🫙' },
  frozen:   { label: 'Frozen',        order: 5, icon: '❄️' },
  bakery:   { label: 'Bakery',        order: 6, icon: '🍞' },
};

/**
 * Unit normalization map: converts plural / shorthand forms to a canonical unit.
 * Amounts are kept in original scale — only labels are normalized so matching works.
 */
const UNIT_ALIASES = {
  tbsps: 'tbsp', tablespoon: 'tbsp', tablespoons: 'tbsp',
  tsps: 'tsp', teaspoon: 'tsp', teaspoons: 'tsp',
  cups: 'cup',
  oz: 'oz', ounce: 'oz', ounces: 'oz',
  lb: 'lb', lbs: 'lb', pound: 'lb', pounds: 'lb',
  can: 'can', cans: 'can',
  whole: 'whole', wholes: 'whole',
  bunch: 'bunch', bunches: 'bunch',
  sprig: 'sprig', sprigs: 'sprig',
  slice: 'slice', slices: 'slice',
  head: 'head', heads: 'head',
  clove: 'whole', cloves: 'whole',
};

function normalizeUnit(unit) {
  if (!unit) return 'unit';
  const lower = unit.toLowerCase().trim();
  return UNIT_ALIASES[lower] ?? lower;
}

/**
 * Normalize an ingredient item name for matching:
 *  - lowercase, trim whitespace
 *  - strip trailing 's' for simple plurals (broccoli florets → broccoli floret)
 *    but keep meaningful endings like 'ness', 'ss', etc.
 */
function normalizeItem(item) {
  return item.toLowerCase().trim();
}

/**
 * Build a composite key for deduplication: "<normalized-item>|<normalized-unit>"
 */
function ingredientKey(item, unit) {
  return `${normalizeItem(item)}|${normalizeUnit(unit)}`;
}

/**
 * Merge ingredients from all selected recipes.
 *
 * Algorithm:
 *  1. Iterate every ingredient of every recipe.
 *  2. Build a key = normalizedItem + normalizedUnit.
 *  3. If the key already exists in our accumulator, sum the amounts.
 *  4. Group results by category.
 *  5. Within each category, sort alphabetically.
 *  6. Return categories sorted by their display order.
 *
 * Returns: Array<{ category, label, icon, items: Array<{ item, amount, unit, key }> }>
 */
export function mergeIngredients(recipes) {
  // Step 1–3: accumulate
  const acc = {}; // key → { item (display name), amount, unit (normalized), category }

  for (const recipe of recipes) {
    for (const ing of recipe.ingredients) {
      const normUnit = normalizeUnit(ing.unit);
      const key = ingredientKey(ing.item, ing.unit);

      if (acc[key]) {
        acc[key].amount += ing.amount;
      } else {
        acc[key] = {
          item: ing.item,
          amount: ing.amount,
          unit: normUnit,
          category: ing.category,
          key,
        };
      }
    }
  }

  // Step 4: group by category
  const grouped = {};
  for (const entry of Object.values(acc)) {
    const cat = entry.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(entry);
  }

  // Step 5–6: sort items and categories
  const result = Object.entries(grouped)
    .map(([cat, items]) => ({
      category: cat,
      label: CATEGORY_META[cat]?.label ?? cat,
      icon: CATEGORY_META[cat]?.icon ?? '•',
      order: CATEGORY_META[cat]?.order ?? 99,
      items: items.sort((a, b) => a.item.localeCompare(b.item)),
    }))
    .sort((a, b) => a.order - b.order);

  return result;
}

/**
 * Format an amount for display: show 1 decimal if needed, else integer.
 * e.g. 1.5 → "1.5", 2.0 → "2", 0.25 → "¼"
 */
export function formatAmount(amount) {
  const fractions = {
    0.25: '¼',
    0.5: '½',
    0.75: '¾',
    0.33: '⅓',
    0.67: '⅔',
  };

  // Check for simple fractions first
  if (fractions[amount]) return fractions[amount];

  // For amounts that are whole numbers
  if (Number.isInteger(amount)) return String(amount);

  // Check if it ends in a common fraction
  const floor = Math.floor(amount);
  const frac = Math.round((amount - floor) * 100) / 100;
  if (fractions[frac] && floor > 0) return `${floor} ${fractions[frac]}`;

  // Otherwise 1 decimal
  return amount.toFixed(1).replace(/\.0$/, '');
}
