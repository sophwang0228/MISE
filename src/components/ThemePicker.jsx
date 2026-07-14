import { useState } from 'react';

export const THEMES = [
  {
    id: 'rose',
    label: 'Rosé 🌸',
    swatch: 'linear-gradient(135deg, #f48fb1, #e91e8c)',
    vars: {
      '--bg-gradient':  'linear-gradient(145deg, #fce4ec 0%, #f8bbd0 45%, #fde8f0 100%)',
      '--card-bg':      'rgba(255, 255, 255, 0.76)',
      '--card-border':  'rgba(255, 255, 255, 0.92)',
      '--accent':       '#d81b60',
      '--accent-bg':    'rgba(216, 27, 96, 0.07)',
      '--accent-dim':   'rgba(216, 27, 96, 0.18)',
      '--text-1':       '#3a0d26',
      '--text-2':       '#7d3a56',
      '--text-3':       '#b07890',
      '--border':       'rgba(216, 27, 96, 0.14)',
      '--shadow':       '0 8px 32px rgba(216, 27, 96, 0.13)',
      '--shadow-sm':    '0 2px 12px rgba(216, 27, 96, 0.08)',
      '--shadow-pop':   '0 20px 60px rgba(216, 27, 96, 0.18)',
    },
  },
  {
    id: 'lavender',
    label: 'Lavender 💜',
    swatch: 'linear-gradient(135deg, #ce93d8, #9c27b0)',
    vars: {
      '--bg-gradient':  'linear-gradient(145deg, #f3e5f5 0%, #e1bee7 45%, #f5eaff 100%)',
      '--card-bg':      'rgba(255, 255, 255, 0.76)',
      '--card-border':  'rgba(255, 255, 255, 0.92)',
      '--accent':       '#7b1fa2',
      '--accent-bg':    'rgba(123, 31, 162, 0.07)',
      '--accent-dim':   'rgba(123, 31, 162, 0.18)',
      '--text-1':       '#2d0845',
      '--text-2':       '#6b3580',
      '--text-3':       '#a07ab8',
      '--border':       'rgba(123, 31, 162, 0.14)',
      '--shadow':       '0 8px 32px rgba(123, 31, 162, 0.13)',
      '--shadow-sm':    '0 2px 12px rgba(123, 31, 162, 0.08)',
      '--shadow-pop':   '0 20px 60px rgba(123, 31, 162, 0.18)',
    },
  },
  {
    id: 'mint',
    label: 'Mint 🌿',
    swatch: 'linear-gradient(135deg, #80cbc4, #00897b)',
    vars: {
      '--bg-gradient':  'linear-gradient(145deg, #e0f2f1 0%, #b2dfdb 45%, #e8f6f5 100%)',
      '--card-bg':      'rgba(255, 255, 255, 0.76)',
      '--card-border':  'rgba(255, 255, 255, 0.92)',
      '--accent':       '#00695c',
      '--accent-bg':    'rgba(0, 105, 92, 0.07)',
      '--accent-dim':   'rgba(0, 105, 92, 0.18)',
      '--text-1':       '#002d27',
      '--text-2':       '#2d6b62',
      '--text-3':       '#6da89e',
      '--border':       'rgba(0, 105, 92, 0.14)',
      '--shadow':       '0 8px 32px rgba(0, 105, 92, 0.13)',
      '--shadow-sm':    '0 2px 12px rgba(0, 105, 92, 0.08)',
      '--shadow-pop':   '0 20px 60px rgba(0, 105, 92, 0.18)',
    },
  },
  {
    id: 'sky',
    label: 'Sky 💙',
    swatch: 'linear-gradient(135deg, #81d4fa, #0288d1)',
    vars: {
      '--bg-gradient':  'linear-gradient(145deg, #e1f5fe 0%, #b3e5fc 45%, #e8f6ff 100%)',
      '--card-bg':      'rgba(255, 255, 255, 0.76)',
      '--card-border':  'rgba(255, 255, 255, 0.92)',
      '--accent':       '#0277bd',
      '--accent-bg':    'rgba(2, 119, 189, 0.07)',
      '--accent-dim':   'rgba(2, 119, 189, 0.18)',
      '--text-1':       '#01243f',
      '--text-2':       '#2a6488',
      '--text-3':       '#70a8c4',
      '--border':       'rgba(2, 119, 189, 0.14)',
      '--shadow':       '0 8px 32px rgba(2, 119, 189, 0.13)',
      '--shadow-sm':    '0 2px 12px rgba(2, 119, 189, 0.08)',
      '--shadow-pop':   '0 20px 60px rgba(2, 119, 189, 0.18)',
    },
  },
  {
    id: 'peach',
    label: 'Peach 🍑',
    swatch: 'linear-gradient(135deg, #ffcc80, #ff7043)',
    vars: {
      '--bg-gradient':  'linear-gradient(145deg, #fff3e0 0%, #ffe0b2 45%, #fff8f0 100%)',
      '--card-bg':      'rgba(255, 255, 255, 0.76)',
      '--card-border':  'rgba(255, 255, 255, 0.92)',
      '--accent':       '#e64a19',
      '--accent-bg':    'rgba(230, 74, 25, 0.07)',
      '--accent-dim':   'rgba(230, 74, 25, 0.18)',
      '--text-1':       '#3e1200',
      '--text-2':       '#7a3a1e',
      '--text-3':       '#b07a60',
      '--border':       'rgba(230, 74, 25, 0.14)',
      '--shadow':       '0 8px 32px rgba(230, 74, 25, 0.13)',
      '--shadow-sm':    '0 2px 12px rgba(230, 74, 25, 0.08)',
      '--shadow-pop':   '0 20px 60px rgba(230, 74, 25, 0.18)',
    },
  },
  {
    id: 'lilac',
    label: 'Lilac 🪻',
    swatch: 'linear-gradient(135deg, #b39ddb, #5e35b1)',
    vars: {
      '--bg-gradient':  'linear-gradient(145deg, #ede7f6 0%, #d1c4e9 45%, #f0eaff 100%)',
      '--card-bg':      'rgba(255, 255, 255, 0.76)',
      '--card-border':  'rgba(255, 255, 255, 0.92)',
      '--accent':       '#4527a0',
      '--accent-bg':    'rgba(69, 39, 160, 0.07)',
      '--accent-dim':   'rgba(69, 39, 160, 0.18)',
      '--text-1':       '#1a0842',
      '--text-2':       '#4a2e80',
      '--text-3':       '#8872b8',
      '--border':       'rgba(69, 39, 160, 0.14)',
      '--shadow':       '0 8px 32px rgba(69, 39, 160, 0.13)',
      '--shadow-sm':    '0 2px 12px rgba(69, 39, 160, 0.08)',
      '--shadow-pop':   '0 20px 60px rgba(69, 39, 160, 0.18)',
    },
  },
];

export default function ThemePicker({ currentTheme, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="theme-picker">
      {open && (
        <div className="theme-swatches">
          <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.4rem', padding: '0 0.2rem' }}>
            Theme
          </div>
          {THEMES.map((t) => (
            <div
              key={t.id}
              className={`swatch-row ${currentTheme === t.id ? 'active' : ''}`}
              onClick={() => { onChange(t.id); setOpen(false); }}
            >
              <div
                className="swatch-circle"
                style={{ background: t.swatch }}
              />
              <span className="swatch-label">{t.label}</span>
              {currentTheme === t.id && <span className="swatch-check">✓</span>}
            </div>
          ))}
        </div>
      )}
      <button
        className="theme-toggle-btn"
        onClick={() => setOpen((x) => !x)}
        aria-label="Choose color theme"
        title="Change color theme"
      >
        🎨
      </button>
    </div>
  );
}
