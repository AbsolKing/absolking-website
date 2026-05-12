import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="clean-shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono-soft text-[10px] uppercase tracking-[0.28em] text-[#569cd6]">
        error 404
      </p>

      <h1 className="mt-5 font-sans text-[5rem] font-bold leading-none tracking-[-0.06em] text-[#d4d4d4] sm:text-[7rem]">
        404
      </h1>

      <p className="mt-4 max-w-md text-lg leading-8 text-[#b7b7b7]">
        Entry not found. It might be on the backlog.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-[#0e639c] px-5 py-2.5 font-mono-soft text-xs font-semibold uppercase tracking-[0.16em] text-[#f3f3f3] transition hover:bg-[#1177bb]"
        >
          Go home
        </Link>
        <Link
          to="/database"
          className="rounded-full border border-[#3e3e42] bg-[#252526] px-5 py-2.5 font-mono-soft text-xs font-semibold uppercase tracking-[0.16em] text-[#d4d4d4] transition hover:border-[#569cd6]/50 hover:bg-[#2d2d30]"
        >
          Browse archive
        </Link>
      </div>

      <p className="mt-12 font-mono-soft text-[10px] uppercase tracking-[0.2em] text-[#6f6f6f]">
        <span className="text-[#569cd6]">const</span> page = <span className="text-[#ce9178]">undefined</span>;
      </p>
    </section>
  )
}
