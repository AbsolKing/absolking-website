import { Link } from 'react-router-dom'

export default function SectionCard({ index, title, description, href }) {
  return (
    <Link
      to={href}
      className="glass-panel-soft glass-hover group rounded-[1.75rem] p-7"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono-soft text-[11px] uppercase tracking-[0.26em] text-slate-400">0{index}</p>
        <span className="h-2.5 w-2.5 rounded-full border border-cyan-200/25 bg-cyan-200/10 transition group-hover:bg-cyan-200/45" />
      </div>
      <h3 className="mt-8 text-2xl font-semibold tracking-tight text-slate-50">{title}</h3>
      <p className="mt-4 text-sm leading-8 text-slate-300/80">{description}</p>
      <p className="mt-10 text-sm font-medium text-sky-200 transition group-hover:translate-x-1">Open section →</p>
    </Link>
  )
}
