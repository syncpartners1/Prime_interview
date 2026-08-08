import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts'

export default function ScoreRadarChart({ aiResult }) {
  if (!aiResult) return null

  const data = [
    { axis: 'תיעדוף', score: aiResult.prioritization_score },
    { axis: 'התאמת DISC', score: aiResult.disc_adaptation_score },
    { axis: 'זיהוי דפוסים', score: aiResult.pattern_recognition_score },
    { axis: 'תדרוך למנמ"ר', score: aiResult.cio_briefing_score },
  ]

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar dataKey="score" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
