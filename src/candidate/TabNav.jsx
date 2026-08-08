const TABS = [
  { id: 'itsm', label: 'סימולטור ITSM' },
  { id: 'inbox', label: 'תיבת דואר נכנס' },
  { id: 'briefing', label: 'תדרוך למנמ"ר' },
]

export default function TabNav({ activeTab, onChangeTab, ticketBadge, emailBadge, onSubmit }) {
  const badgeFor = (tabId) => {
    if (tabId === 'itsm') return ticketBadge
    if (tabId === 'inbox') return emailBadge
    return 0
  }

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex gap-1">
        {TABS.map((tab) => {
          const badge = badgeFor(tab.id)
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {badge > 0 && (
                <span className="absolute -top-1 -left-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <button
        onClick={onSubmit}
        className="my-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        הגש מבחן
      </button>
    </nav>
  )
}
