import { Link } from 'react-router-dom'

const statusColors = {
  completed:  '#4ec9b0',
  watching:   '#569cd6',
  reading:    '#569cd6',
  playing:    '#569cd6',
  'on-hold':  '#dcdcaa',
  played:     '#4ec9b0',
  backlog:    '#3e3e42',
  planned:    '#3e3e42',
  dropped:    '#ce9178',
}

export default function MediaRow({ index, item, onOpen }) {
  const hasScore = typeof item.score === 'number'
  const metaParts = [item.type, item.progress].filter(Boolean)
  const isUnranked = item.statusKey === 'backlog' || item.statusKey === 'planned'
  const accentColor = statusColors[item.statusKey] ?? '#3e3e42'

  const open = onOpen ? () => onOpen(item) : undefined
  const onKeyDown =
    onOpen
      ? (e) => {
          // Only fire when the article itself is focused (not when Enter bubbles
          // up from the inner review link).
          if (e.target !== e.currentTarget) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen(item)
          }
        }
      : undefined

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border border-[#333337] bg-[#202020]/78 transition duration-300 hover:border-[#4b4b50] hover:bg-[#242426] ${
        isUnranked ? 'opacity-80' : ''
      } ${onOpen ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#569cd6]/60' : ''}`}
      onClick={open}
      onKeyDown={onKeyDown}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl transition-all duration-300 group-hover:w-[4px]"
        style={{ background: accentColor, opacity: isUnranked ? 0.35 : 0.75 }}
      />

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3.5 pl-5 sm:gap-5 sm:p-4 sm:pl-6">
        <div className="hidden w-11 text-right sm:block">
          <span className="font-mono-soft text-xs uppercase tracking-[0.14em] text-[#569cd6]/80">{String(index).padStart(2, '0')}</span>
        </div>

        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <div className="w-[68px] flex-shrink-0 overflow-hidden rounded-md border border-[#3e3e42] bg-[#1e1e1e] sm:w-[88px]">
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-soft text-[10px] uppercase tracking-[0.14em] text-[#569cd6] sm:hidden">
                {String(index).padStart(2, '0')}
              </span>
              {item.status ? (
                <span
                  className="inline-flex items-center gap-1 font-mono-soft text-[9px] uppercase tracking-[0.18em]"
                  style={{ color: accentColor }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: accentColor, opacity: isUnranked ? 0.5 : 1 }}
                  />
                  {item.status}
                </span>
              ) : null}
            </div>

            <h3 className="mt-2 truncate text-base font-semibold tracking-[-0.018em] text-[#d4d4d4] sm:text-xl">{item.title}</h3>

            {metaParts.length ? (
              <p className="mt-1 truncate font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#8f8f8f]">{metaParts.join(' • ')}</p>
            ) : null}

            {item.note ? (
              item.reviewPath ? (
                <Link
                  to={item.reviewPath}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 inline-block line-clamp-1 max-w-2xl text-sm leading-6 text-[#8f8f8f] underline-offset-2 transition hover:text-[#4ec9b0] hover:underline"
                >
                  {item.note} →
                </Link>
              ) : (
                <p className="mt-2 line-clamp-1 max-w-2xl text-sm leading-6 text-[#a9a9a9]">{item.note}</p>
              )
            ) : null}
          </div>
        </div>

        <div className="flex justify-end pl-1 sm:min-w-24">
          {hasScore ? (
            <div className="flex items-baseline gap-1 border-l border-[#3e3e42] pl-4 transition duration-300 group-hover:border-[#4ec9b0]/45">
              <span className="font-mono-soft text-2xl font-semibold leading-none tracking-[-0.05em] text-[#d4d4d4] sm:text-3xl">{item.score}</span>
              <span className="font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f]">/10</span>
            </div>
          ) : (
            <span className="hidden border-l border-[#3e3e42] pl-4 font-mono-soft text-[10px] uppercase tracking-[0.14em] text-[#6f6f6f] sm:inline-flex">
              unrated
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
