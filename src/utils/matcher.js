/**
 * Converts the user's cooking-time preference to a max minutes value.
 */
const TIME_MAP = {
  quick: 20,
  moderate: 40,
  any: Infinity,
};

/**
 * Converts the user's budget preference to a set of allowed budget tiers.
 */
const BUDGET_MAP = {
  low: ['low'],
  medium: ['low', 'medium'],
  any: ['low', 'medium', 'high'],
};

/**
 * Filter recipes to only those that match every user constraint.
 * A recipe passes if:
 *  - its goals array contains the user's goal
 *  - the user's dietary restriction is "none" OR the recipe's diet array includes it
 *  - cook time is within the user's tolerance
 *  - budget tier is within the user's allowed set
 */
export function filterRecipes(recipes, { goal, diet, cookingTime, budget }) {
  const maxMinutes = TIME_MAP[cookingTime] ?? Infinity;
  const allowedBudgets = BUDGET_MAP[budget] ?? ['low', 'medium', 'high'];

  return recipes.filter((r) => {
    const goalMatch = r.goals.includes(goal);
    const dietMatch = diet === 'none' || r.diet.includes(diet);
    const timeMatch = r.time_minutes <= maxMinutes;
    const budgetMatch = allowedBudgets.includes(r.budget);
    return goalMatch && dietMatch && timeMatch && budgetMatch;
  });
}

/**
 * Shuffle an array in place using Fisher-Yates.
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Select N recipes from the filtered pool with variety-aware logic:
 *   1. Score each recipe by how many times its proteinType has already been picked.
 *   2. Always prefer recipes with a lower protein-type usage count.
 *   3. If the pool is smaller than N, allow repetitions (but still apply variety logic).
 *
 * Returns an array of recipe objects (may contain duplicates if pool < N).
 */
export function selectMeals(filteredRecipes, count) {
  if (filteredRecipes.length === 0) return [];

  const proteinUsage = {};
  const selected = [];
  const pool = shuffle(filteredRecipes);

  // Build initial selection without repeats, prioritizing variety.
  const remaining = [...pool];

  while (selected.length < count && remaining.length > 0) {
    // Score: lower is better (less-used protein type)
    remaining.sort((a, b) => {
      const scoreA = proteinUsage[a.proteinType] ?? 0;
      const scoreB = proteinUsage[b.proteinType] ?? 0;
      return scoreA - scoreB;
    });

    const pick = remaining.shift();
    selected.push(pick);
    proteinUsage[pick.proteinType] = (proteinUsage[pick.proteinType] ?? 0) + 1;
  }

  // If we still need more meals, re-use pool recipes (allows repeats).
  if (selected.length < count) {
    const refill = shuffle(filteredRecipes);
    let i = 0;
    while (selected.length < count) {
      selected.push(refill[i % refill.length]);
      i++;
    }
  }

  return selected;
}

/**
 * Swap a single meal at a given index for a different recipe from the filtered pool.
 * Tries to pick a recipe with a different proteinType from the adjacent meals.
 */
export function swapMeal(currentPlan, indexToSwap, filteredRecipes) {
  const currentId = currentPlan[indexToSwap].id;
  const neighborProteinTypes = currentPlan
    .filter((_, i) => i !== indexToSwap)
    .map((r) => r.proteinType);

  // Candidates: everything except the current meal
  const candidates = filteredRecipes.filter((r) => r.id !== currentId);
  if (candidates.length === 0) return currentPlan;

  // Prefer candidates whose proteinType doesn't appear in neighbors
  const preferred = candidates.filter(
    (r) => !neighborProteinTypes.includes(r.proteinType)
  );
  const pool = preferred.length > 0 ? preferred : candidates;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  const newPlan = [...currentPlan];
  newPlan[indexToSwap] = pick;
  return newPlan;
}
