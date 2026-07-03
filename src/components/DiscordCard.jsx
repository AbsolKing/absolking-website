const DISCORD_USERNAME = 'absolking'
const DISCORD_PFP = '/discord-pfp.webp'

export default function DiscordCard({ open, onClose }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0d0d0d]/82 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="clean-panel relative w-full max-w-xs overflow-hidden rounded-2xl fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="editor-topbar">
          <span className="window-dot bg-[#ce9178]" />
          <span className="window-dot bg-[#dcdcaa]" />
          <span className="window-dot bg-[#4ec9b0]" />
          <span className="ml-2 truncate font-mono-soft text-[11px] text-[#8f8f8f]">
            discord.json
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto font-mono-soft text-xs text-[#6f6f6f] transition hover:text-[#d4d4d4]"
            aria-label="Close"
          >
            ✕ esc
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 p-7">
          <img
            src={DISCORD_PFP}
            alt={DISCORD_USERNAME}
            className="h-24 w-24 rounded-full border border-[#3e3e42] object-cover"
          />
          <div className="text-center">
            <p className="font-mono-soft text-sm text-[#d4d4d4]">{DISCORD_USERNAME}</p>
            <p className="mt-1 font-mono-soft text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f]">
              No server yet :(
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
