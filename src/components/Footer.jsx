export default function Footer() {
  return (
    <footer className="clean-shell pb-5 pt-5 sm:pb-7 sm:pt-7">
      <div className="relative pt-5 sm:pt-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#569cd6]/40 to-transparent" />

        <div>
          <p className="font-mono-soft text-sm font-semibold uppercase tracking-[0.18em] text-[#d4d4d4]">
            <span className="syntax-blue">export default</span> ABSOLKING / Archive
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#8f8f8f]">
            A personal home for writing, rankings, and the media worth keeping track of over time.
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.2em] text-[#6f6f6f]">
            v1.6.0-dateadded
          </p>
          <p className="font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f]">
            © {new Date().getFullYear()} AbsolKing
          </p>
        </div>
      </div>
    </footer>
  )
}
