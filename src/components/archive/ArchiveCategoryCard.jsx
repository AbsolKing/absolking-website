import { Link } from 'react-router-dom'

export default function ArchiveCategoryCard({ title, description, href, image, count, statusLabel }) {
  return (
    <Link to={href} className="clean-card clean-hover group block overflow-hidden rounded-xl">
      <div className="relative h-48 overflow-hidden border-b border-[#3e3e42]">
        <img src={image} alt="" className="h-full w-full object-cover opacity-62 grayscale-[10%] transition duration-500 group-hover:scale-[1.025] group-hover:opacity-76" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/24 to-transparent" />
        {statusLabel ? (
          <div className="absolute bottom-4 left-4 rounded-md border border-[#3e3e42] bg-[#252526]/90 px-3 py-1.5 font-mono-soft text-[10px] uppercase tracking-[0.15em] text-[#4ec9b0]">
            {statusLabel}
          </div>
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 font-mono-soft text-[10px] uppercase tracking-[0.18em] text-[#8f8f8f]">
          <span>collection</span>
          <span>{count} entries</span>
        </div>
        <h3 className="mt-5 text-2xl font-semibold tracking-[-0.025em] text-[#d4d4d4]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#b7b7b7]">{description}</p>
        <p className="mt-7 font-mono-soft text-xs text-[#4ec9b0] transition group-hover:translate-x-1">open() →</p>
      </div>
    </Link>
  )
}
