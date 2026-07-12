import { Link } from 'react-router-dom'

export default function ClosedDatabasePage() {
  return (
    <section className="clean-shell py-10 sm:py-14 lg:py-18">
      <div className="clean-panel overflow-hidden rounded-2xl fade-up">
        <div className="editor-topbar">
          <span className="window-dot bg-[#ce9178]" />
          <span className="window-dot bg-[#dcdcaa]" />
          <span className="window-dot bg-[#4ec9b0]" />
          <span className="ml-2 font-mono-soft text-[11px] text-[#8f8f8f]">database.closed</span>
        </div>

        <div className="p-6 sm:p-8">
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">
            <span className="text-[#569cd6]">//</span> access denied (politely)
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
            <pre className="select-none overflow-auto rounded-xl border border-[#3e3e42] bg-[#1e1e1e]/60 p-5 font-mono-soft text-[11px] leading-[1.15] text-[#dcdcaa]">
{String.raw`        _
     .-( )-.
    /       \
    \       /
     '-(_)-'
        \\
         \\
          \\   (database offline)
`}
            </pre>

            <div className="space-y-4">
              <p className="text-base leading-8 text-[#b7b7b7] sm:text-lg sm:leading-9">
                You closed <span className="font-mono-soft text-[#d4d4d4]">/database</span>. The archive will remember
                this.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/database"
                  className="inline-flex items-center justify-center rounded-lg border border-[#569cd6]/55 bg-[#094771] px-5 py-3 font-mono-soft text-xs font-semibold uppercase tracking-[0.14em] text-[#d4d4d4] transition hover:-translate-y-0.5 hover:border-[#569cd6] hover:bg-[#0e639c]"
                >
                  Reopen Database
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-lg border border-[#3e3e42] bg-[#252526] px-5 py-3 font-mono-soft text-xs font-semibold uppercase tracking-[0.14em] text-[#d4d4d4] transition hover:-translate-y-0.5 hover:border-[#4ec9b0]/45 hover:bg-[#2d2d30]"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
