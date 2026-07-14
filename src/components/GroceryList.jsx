import { useState } from 'react';
import { formatAmount } from '../utils/groceryMerger.js';

export default function GroceryList({ categories }) {
  const [checked, setChecked] = useState({});
  const [collapsed, setCollapsed] = useState({});

  function toggleItem(key) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleCategory(cat) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  function checkAllInCategory(cat, items) {
    const allChecked = items.every((item) => checked[item.key]);
    const update = {};
    items.forEach((item) => { update[item.key] = !allChecked; });
    setChecked((prev) => ({ ...prev, ...update }));
  }

  const totalItems = categories.reduce((n, c) => n + c.items.length, 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="grocery-shell">
      <div className="grocery-header-row">
        <div>
          <h2 className="grocery-title">Shopping List</h2>
          <p className="grocery-sub">
            {checkedCount} of {totalItems} items checked off
          </p>
        </div>
        <div className="grocery-progress-ring">
          <svg viewBox="0 0 40 40" className="ring-svg">
            <circle className="ring-bg" cx="20" cy="20" r="16" />
            <circle
              className="ring-fill"
              cx="20"
              cy="20"
              r="16"
              strokeDasharray={`${totalItems > 0 ? (checkedCount / totalItems) * 100.5 : 0} 100.5`}
              strokeDashoffset="0"
            />
          </svg>
          <span className="ring-label">
            {totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0}%
          </span>
        </div>
      </div>

      <p className="grocery-tip">
        Tap items as you shop. Ingredients are merged and deduplicated across all your meals.
      </p>

      <div className="grocery-categories">
        {categories.map((cat) => {
          const isCollapsed = collapsed[cat.category];
          const allChecked = cat.items.every((item) => checked[item.key]);

          return (
            <section key={cat.category} className="grocery-category">
              <div className="cat-header" onClick={() => toggleCategory(cat.category)}>
                <div className="cat-header-left">
                  <span className="cat-icon">{cat.icon}</span>
                  <h3 className="cat-label">{cat.label}</h3>
                  <span className="cat-count">{cat.items.length}</span>
                </div>
                <div className="cat-header-right">
                  <button
                    className="check-all-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      checkAllInCategory(cat.category, cat.items);
                    }}
                  >
                    {allChecked ? 'Uncheck all' : 'Check all'}
                  </button>
                  <span className="cat-chevron">{isCollapsed ? '▸' : '▾'}</span>
                </div>
              </div>

              {!isCollapsed && (
                <ul className="grocery-items">
                  {cat.items.map((item) => (
                    <li
                      key={item.key}
                      className={`grocery-item ${checked[item.key] ? 'checked' : ''}`}
                      onClick={() => toggleItem(item.key)}
                    >
                      <span className="item-checkbox">
                        {checked[item.key] ? '✓' : ''}
                      </span>
                      <span className="item-name">{item.item}</span>
                      <span className="item-amount">
                        {formatAmount(item.amount)} {item.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div className="grocery-footer">
        <button
          className="clear-checks-btn"
          onClick={() => setChecked({})}
        >
          Reset all checks
        </button>
      </div>
    </div>
  );
}
