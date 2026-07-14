import { useState } from 'react';

export const THEMES = [
  {
    id: 'lavender',
    label: 'Lavender 💜',
    swatch: 'linear-gradient(135deg, #e1bee7, #9c27b0)',
    bg: 'linear-gradient(145deg, #f3e5f5 0%, #e1bee7 50%, #f3e5f5 100%)',
    accent:    '#7b1fa2',
    accentBg:  'rgba(123, 31, 162, 0.08)',
    accentDim: 'rgba(123, 31, 162, 0.2)',
  },
  {
    id: 'rose',
    label: 'Rosé 🌸',
    swatch: 'linear-gradient(135deg, #f8bbd0, #e91e8c)',
    bg: 'linear-gradient(145deg, #fce4ec 0%, #f8bbd0 50%, #fce4ec 100%)',
    accent:    '#c2185b',
    accentBg:  'rgba(194, 24, 91, 0.08)',
    accentDim: 'rgba(194, 24, 91, 0.2)',
  },
  {
    id: 'mint',
    label: 'Mint 🌿',
    swatch: 'linear-gradient(135deg, #b2dfdb, #00897b)',
    bg: 'linear-gradient(145deg, #e0f2f1 0%, #b2dfdb 50%, #e0f2f1 100%)',
    accent:    '#00695c',
    accentBg:  'rgba(0, 105, 92, 0.08)',
    accentDim: 'rgba(0, 105, 92, 0.2)',
  },
  {
    id: 'sky',
    label: 'Sky 💙',
    swatch: 'linear-gradient(135deg, #bbdefb, #0288d1)',
    bg: 'linear-gradient(145deg, #e1f5fe 0%, #b3e5fc 50%, #e1f5fe 100%)',
    accent:    '#01579b',
    accentBg:  'rgba(1, 87, 155, 0.08)',
    accentDim: 'rgba(1, 87, 155, 0.2)',
  },
  {
    id: 'peach',
    label: 'Peach 🍑',
    swatch: 'linear-gradient(135deg, #ffe0b2, #ff7043)',
    bg: 'linear-gradient(145deg, #fff3e0 0%, #ffe0b2 50%, #fff3e0 100%)',
    accent:    '#bf360c',
    accentBg:  'rgba(191, 54, 12, 0.08)',
    accentDim: 'rgba(191, 54, 12, 0.2)',
  },
  {
    id: 'lilac',
    label: 'Lilac 🪻',
    swatch: 'linear-gradient(135deg, #d1c4e9, #5e35b1)',
    bg: 'linear-gradient(145deg, #ede7f6 0%, #d1c4e9 50%, #ede7f6 100%)',
    accent:    '#4527a0',
    accentBg:  'rgba(69, 39, 160, 0.08)',
    accentDim: 'rgba(69, 39, 160, 0.2)',
  },
  {
    id: 'blush',
    label: 'Blush 🩷',
    swatch: 'linear-gradient(135deg, #ffcdd2, #e57373)',
    bg: 'linear-gradient(145deg, #fff0f0 0%, #ffcdd2 50%, #fff0f0 100%)',
    accent:    '#b71c1c',
    accentBg:  'rgba(183, 28, 28, 0.08)',
    accentDim: 'rgba(183, 28, 28, 0.2)',
  },
];

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export default function ThemePicker({ currentTheme, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="theme-picker">
      {open && (
        <div className="theme-swatches">
          <div className="swatch-section-label">Choose a vibe</div>
          {THEMES.map((t) => (
            <div
              key={t.id}
              className={`swatch-row ${currentTheme === t.id ? 'active' : ''}`}
              onClick={() => { onChange(t.id); setOpen(false); }}
            >
              <div className="swatch-circle" style={{ background: t.swatch }} />
              <span className="swatch-label">{t.label}</span>
              {currentTheme === t.id && <span className="swatch-check">✓</span>}
            </div>
          ))}
        </div>
      )}
      <button
        className="theme-toggle-btn"
        onClick={() => setOpen((x) => !x)}
        aria-label="Change color theme"
        title="Change vibe"
      >
        🎨
      </button>
    </div>
  );
}
