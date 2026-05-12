export const URGENT_KEYWORDS = [
  'urgent', 'asap', 'emergency', 'immediately', 'now',
  'payment', 'pay', 'paid', 'refund', 'where is',
  'not received', 'fake', 'scam', 'angry', 'disappointed'
]

export function calculateUrgency(content: string, receivedAt: string): number {
  let score = 0
  const text = content.toLowerCase()

  // Time factor: +2 per hour waiting, max 40
  const hoursWaiting = (Date.now() - new Date(receivedAt).getTime()) / 3_600_000
  score += Math.min(Math.floor(hoursWaiting * 2), 40)

  // Keyword factor: +10 per urgent keyword found
  for (const keyword of URGENT_KEYWORDS) {
    if (text.includes(keyword)) score += 10
  }

  // Question mark = customer waiting for answer
  if (text.includes('?')) score += 5

  return score
}