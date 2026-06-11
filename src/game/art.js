// SVG assets kept as strings (rendered with dangerouslySetInnerHTML) so we don't
// hand-convert every attribute to JSX. Card icons use stroke="currentColor" so
// they inherit the card's type color. Colors reference the site's palette.

const C = { steel: '#6b6f76', dark: '#3a3d42', darker: '#2b2d31', blue: '#569cd6', cyan: '#4ec9b0', red: '#f44747', orange: '#ce9178' };

export const ICONS = {
  bolt: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M13 2 5 13h6l-1 9 9-12h-6z"/></svg>`,
  shield: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z"/></svg>`,
  burst: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5 19 19M19 5l-3.5 3.5M8.5 15.5 5 19"/><circle cx="12" cy="12" r="2.4"/></svg>`,
  fast: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l7 6-7 6M11 6l7 6-7 6"/></svg>`,
  deflect: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z"/><path d="M9 11l2.4 2.4L15 9"/></svg>`,
  slam: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v8M16 3v8M5 11h14M7 11l2 9M17 11l-2 9"/></svg>`,
  brace: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l8 3v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z"/><path d="M12 8v6M9 11l3-3 3 3"/></svg>`,
  sweep: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9"/><path d="M18 9l3 3-3 3"/><path d="M7 16l-2 2M11 18l-1 2M15 16l1 2"/></svg>`,
  rail: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h13M15 7l5 5-5 5M4 9v6M7 10v4"/></svg>`,
  chip: `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/><path d="M12 14V9l-2 2.5"/></svg>`,
};

export const SPRITES = {
  skitter: () => `<svg width="140" height="140" viewBox="0 0 120 100">
    <defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.steel}"/><stop offset="1" stop-color="${C.darker}"/></linearGradient></defs>
    <path d="M22 70l-12 14M44 74l-8 18M76 74l8 18M98 70l12 14M30 66l-16 6M90 66l16 6" stroke="${C.dark}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <rect x="30" y="44" width="60" height="30" rx="11" fill="url(#sk)" stroke="#1c1d20" stroke-width="2.5"/>
    <rect x="38" y="40" width="44" height="12" rx="6" fill="${C.darker}" stroke="#1c1d20" stroke-width="2"/>
    <circle cx="60" cy="59" r="9" fill="#140606" stroke="#1c1d20" stroke-width="2"/>
    <circle cx="60" cy="59" r="4.5" fill="${C.red}"/><circle cx="60" cy="59" r="2" fill="#ffd2d2"/>
    <path d="M40 67h8M72 67h8" stroke="${C.cyan}" stroke-width="2" opacity=".7"/></svg>`,
  drone: () => `<svg width="150" height="150" viewBox="0 0 130 110">
    <defs><radialGradient id="dr" cx="50%" cy="35%"><stop offset="0" stop-color="${C.steel}"/><stop offset="1" stop-color="${C.darker}"/></radialGradient></defs>
    <path d="M22 26l24 14M108 26l-24 14" stroke="${C.dark}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="22" cy="24" rx="15" ry="5" fill="${C.dark}" stroke="#1c1d20" stroke-width="1.5"/>
    <ellipse cx="108" cy="24" rx="15" ry="5" fill="${C.dark}" stroke="#1c1d20" stroke-width="1.5"/>
    <path d="M40 44h50l10 20c0 14-16 26-35 26S30 78 30 64z" fill="url(#dr)" stroke="#1c1d20" stroke-width="2.5"/>
    <rect x="44" y="50" width="42" height="18" rx="9" fill="#0e0e10" stroke="#1c1d20" stroke-width="2"/>
    <circle cx="65" cy="59" r="6" fill="${C.red}"/><circle cx="65" cy="59" r="2.6" fill="#ffd2d2"/>
    <path d="M50 59h6M74 59h6" stroke="${C.cyan}" stroke-width="2"/>
    <path d="M48 84c6 6 28 6 34 0" stroke="${C.blue}" stroke-width="2" fill="none" opacity=".7"/></svg>`,
  sentinel: () => `<svg width="160" height="160" viewBox="0 0 100 140">
    <defs><linearGradient id="se" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.steel}"/><stop offset="1" stop-color="${C.darker}"/></linearGradient></defs>
    <rect x="30" y="6" width="40" height="30" rx="9" fill="url(#se)" stroke="#1c1d20" stroke-width="2.5"/>
    <rect x="36" y="14" width="28" height="9" rx="4" fill="#0e0e10" stroke="#1c1d20" stroke-width="1.5"/>
    <rect x="40" y="16" width="20" height="5" rx="2.5" fill="${C.blue}"/>
    <path d="M44 36h12v8H44z" fill="${C.dark}"/>
    <path d="M26 46h48l6 50c0 8-16 14-30 14s-30-6-30-14z" fill="url(#se)" stroke="#1c1d20" stroke-width="2.5"/>
    <path d="M40 58h20M40 68h20" stroke="#1c1d20" stroke-width="2"/>
    <circle cx="50" cy="84" r="7" fill="${C.cyan}" opacity=".9" stroke="#1c1d20" stroke-width="1.5"/>
    <path d="M22 50l-10 40 10 4M78 50l10 40-10 4" stroke="${C.dark}" stroke-width="7" stroke-linecap="round" fill="none"/></svg>`,
  warden: () => `<svg width="200" height="200" viewBox="0 0 150 150">
    <defs><linearGradient id="wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.steel}"/><stop offset="1" stop-color="#26282c"/></linearGradient></defs>
    <path d="M40 40h70l8 60c0 14-22 24-43 24s-43-10-43-24z" fill="url(#wa)" stroke="#161719" stroke-width="3"/>
    <rect x="56" y="20" width="38" height="26" rx="8" fill="url(#wa)" stroke="#161719" stroke-width="2.5"/>
    <rect x="62" y="28" width="26" height="8" rx="4" fill="#0e0e10"/><rect x="66" y="30" width="18" height="4" fill="${C.red}"/>
    <path d="M30 50h90" stroke="${C.orange}" stroke-width="4" stroke-dasharray="9 7" opacity=".8"/>
    <path d="M118 56l16 50-16 8" stroke="${C.dark}" stroke-width="11" stroke-linecap="round" fill="none"/>
    <rect x="14" y="48" width="34" height="64" rx="8" fill="${C.dark}" stroke="#161719" stroke-width="2.5"/>
    <path d="M31 56v48" stroke="${C.cyan}" stroke-width="2.5" opacity=".8"/>
    <circle cx="75" cy="92" r="9" fill="${C.cyan}" opacity=".85" stroke="#161719" stroke-width="1.5"/></svg>`,
  core: () => `<svg width="220" height="220" viewBox="0 0 170 160">
    <defs><radialGradient id="co" cx="50%" cy="45%"><stop offset="0" stop-color="#3a3d42"/><stop offset="1" stop-color="#1a1b1e"/></radialGradient>
    <radialGradient id="eye" cx="50%" cy="50%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${C.red}"/><stop offset="1" stop-color="#5a0c0c"/></radialGradient></defs>
    <path d="M30 60l-22 18 22 18M140 60l22 18-22 18" stroke="${C.dark}" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M40 70l-14 8 14 8M130 70l14 8-14 8" stroke="${C.orange}" stroke-width="3" fill="none" opacity=".7"/>
    <path d="M85 26 L132 53 L132 103 L85 130 L38 103 L38 53 Z" fill="url(#co)" stroke="#0c0d0e" stroke-width="3"/>
    <path d="M85 40 L120 60 L120 96 L85 116 L50 96 L50 60 Z" fill="#121315" stroke="${C.steel}" stroke-width="1.5"/>
    <circle cx="85" cy="78" r="22" fill="#0a0a0c" stroke="#0c0d0e" stroke-width="2"/>
    <circle cx="85" cy="78" r="14" fill="url(#eye)"/><circle cx="85" cy="78" r="5" fill="#1a0303"/>
    <path d="M50 60l8 4M120 60l-8 4M50 96l8-4M120 96l-8-4" stroke="${C.cyan}" stroke-width="2" opacity=".8"/>
    <path d="M85 26v-12M85 130v12" stroke="${C.dark}" stroke-width="5" stroke-linecap="round"/></svg>`,
  operator: () => `<svg width="160" height="160" viewBox="0 0 110 150">
    <defs><linearGradient id="op" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5560"/><stop offset="1" stop-color="#23282e"/></linearGradient></defs>
    <rect x="36" y="8" width="38" height="32" rx="10" fill="url(#op)" stroke="#12161a" stroke-width="2.5"/>
    <path d="M42 18h26v10H42z" fill="#0c0f12"/><path d="M45 21h20v4H45z" fill="${C.cyan}"/>
    <path d="M30 44h50l6 56c0 9-18 16-31 16s-31-7-31-16z" fill="url(#op)" stroke="#12161a" stroke-width="2.5"/>
    <path d="M44 58h22M44 70h22" stroke="#12161a" stroke-width="2"/>
    <circle cx="55" cy="88" r="7" fill="${C.blue}" stroke="#12161a" stroke-width="1.5"/>
    <path d="M24 50l-8 44 9 4" stroke="${C.dark}" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M82 52l6 40" stroke="${C.dark}" stroke-width="8" stroke-linecap="round"/>
    <rect x="84" y="14" width="6" height="42" rx="3" fill="${C.cyan}" opacity=".9"/>
    <rect x="85.5" y="14" width="3" height="42" fill="#cffaf2"/>
    <rect x="80" y="52" width="14" height="7" rx="2" fill="${C.steel}" stroke="#12161a" stroke-width="1.5"/></svg>`,
};
