export default function BriefingAlertBanner({ onGoToBriefing }) {
  return (
    <div className="flex animate-pulse items-center justify-between gap-3 border-b border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
      <span>⚠ נותרו פחות מ-5 דקות ועדיין לא כתבת דבר בתדרוך למנמ"ר!</span>
      <button
        onClick={onGoToBriefing}
        className="shrink-0 rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
      >
        עבור לתדרוך
      </button>
    </div>
  )
}
