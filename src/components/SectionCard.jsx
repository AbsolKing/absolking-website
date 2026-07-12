import { Link } from 'react-router-dom'

const indexColors = ['#569cd6', '#4ec9b0', '#ce9178', '#dcdcaa']

export default function SectionCard({ index, title, description, href, count }) {
  const accentColor = indexColors[(index - 1) % indexColors.length]

  return (
    <Link
      to={href}
      className="clean-card clean-hover group relative block overflow-hidden rounded-xl p-6 sm:p-7"
    >
      {/* Top accent line */}
      <div
        className="absolute left-0 right-0 top-0 h-[2px] opacity-50 transition-opacity duration-300 group-hover:opacity-90"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      <div className="flex items-center justify-between gap-4">
        <span
          className="font-mono-soft text-[10px] uppercase tracking-[0.22em]"
          style={{ color: accentColor }}
        >
          entry_{String(index).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          {count != null && (
            <span
              className="rounded-md border px-2 py-0.5 font-mono-soft text-[9px] uppercase tracking-[0.16em]"
              style={{
                borderColor: `${accentColor}33`,
                background: `${accentColor}11`,
                color: accentColor,
              }}
            >
              {count} entries
            </span>
          )}
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md border text-[10px] transition-all duration-300 group-hover:scale-110"
            style={{
              borderColor: `${accentColor}44`,
              background: `${accentColor}11`,
              color: accentColor,
            }}
          >
            →
          </span>
        </div>
      </div>
      <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em] text-[#d4d4d4]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#b7b7b7]">{description}</p>
      <p
        className="mt-8 font-mono-soft text-xs opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-90"
        style={{ color: accentColor }}
      >
        open() →
      </p>
    </Link>
  )
}
