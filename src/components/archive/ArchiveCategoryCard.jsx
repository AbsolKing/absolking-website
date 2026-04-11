import { Link } from 'react-router-dom'

export default function ArchiveCategoryCard({ title, description, href, image, count, statusLabel }) {
  return (
    <Link to={href} className="glass-panel-soft glass-hover group overflow-hidden rounded-[1.75rem]">
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-slate-400">
          <span>{statusLabel}</span>
          <span>{count} entries</span>
        </div>
        <h3 className="mt-5 text-2xl font-semibold text-slate-50">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300/80">{description}</p>
        <p className="mt-8 text-sm font-medium text-sky-200 transition group-hover:translate-x-1">Open page →</p>
      </div>
    </Link>
  )
}
