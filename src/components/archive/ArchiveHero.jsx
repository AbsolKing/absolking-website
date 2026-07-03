import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ArchiveHero({ title, subtitle, image, stats = [] }) {
  const [windowState, setWindowState] = useState('normal') // 'normal' | 'expanded' | 'minimized' | 'closed'

  const breadcrumb = (
    <span className="ml-2 truncate font-mono-soft text-[11px] text-[#8f8f8f]">
      <Link to="/" className="transition hover:text-[#d4d4d4]">home</Link>
      <span className="text-[#6f6f6f]"> / </span>
      <Link to="/database" className="transition hover:text-[#d4d4d4]">database</Link>
      <span className="text-[#6f6f6f]"> / </span>
      <span className="text-[#d4d4d4]">{title.toLowerCase()}.json</span>
    </span>
  )

  return (
    <section className="clean-shell">
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: windowState === 'closed' ? '0fr' : '1fr' }}
      >
        <div className="overflow-hidden">
          <div className="py-8 sm:py-12 lg:py-16">
            <div className="clean-panel overflow-hidden rounded-2xl fade-up">
              <div className="editor-topbar">
                <button
                  type="button"
                  onClick={() => setWindowState('closed')}
                  className="window-dot bg-[#ce9178] transition hover:brightness-125"
                  aria-label="Close"
                />
                <button
                  type="button"
                  onClick={() => setWindowState(windowState === 'expanded' ? 'normal' : 'expanded')}
                  className="window-dot bg-[#dcdcaa] transition hover:brightness-125"
                  aria-label={windowState === 'expanded' ? 'Restore' : 'Expand'}
                />
                <button
                  type="button"
                  onClick={() => setWindowState(windowState === 'minimized' ? 'normal' : 'minimized')}
                  className="window-dot bg-[#4ec9b0] transition hover:brightness-125"
                  aria-label={windowState === 'minimized' ? 'Restore' : 'Minimize'}
                />
                {breadcrumb}
              </div>

              {windowState !== 'minimized' && (
                <div
                  className={`relative transition-[min-height] duration-300 ${
                    windowState === 'expanded' ? 'min-h-[520px] sm:min-h-[640px]' : 'min-h-[310px] sm:min-h-[380px]'
                  }`}
                >
                  <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-58 grayscale-[15%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/78 to-[#1e1e1e]/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1e1e1e]/75 via-[#1e1e1e]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                    <p className="font-mono-soft text-[10px] uppercase tracking-[0.24em] text-[#4ec9b0]">// archive section</p>
                    <h1 className="mt-4 text-[3rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[#d4d4d4] sm:text-7xl">{title}</h1>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-[#b7b7b7] sm:text-lg sm:leading-8">{subtitle}</p>
                    {stats.length ? (
                      <div className="mt-6 flex flex-wrap gap-2.5">
                        {stats.map((stat) => (
                          <div key={stat.label} className="rounded-lg border border-[#3e3e42] bg-[#1e1e1e]/80 px-4 py-2 backdrop-blur-sm">
                            <span className="font-mono-soft text-sm font-semibold text-[#dcdcaa]">{stat.value}</span>
                            <span className="ml-2 font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f]">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
