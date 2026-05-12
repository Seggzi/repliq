import type { Intent } from '@/types'

const FAQ_KEYWORDS = ['price', 'cost', 'how much', 'delivery', 'shipping',
  'location', 'address', 'open', 'hours', 'available', 'do you have', 'stock']

const ORDER_KEYWORDS = ['order', 'buy', 'purchase', 'want to get', 'i want',
  'send me', 'i need', 'place an order', 'how to order']

const COMPLAINT_KEYWORDS = ['complaint', 'bad', 'terrible', 'disappointed',
  'not working', 'broken', 'wrong', 'refund', 'return', 'damaged', 'missing']

export function classifyIntent(content: string): Intent {
  const text = content.toLowerCase()

  const faqScore     = FAQ_KEYWORDS.filter(k => text.includes(k)).length
  const orderScore   = ORDER_KEYWORDS.filter(k => text.includes(k)).length
  const complainScore = COMPLAINT_KEYWORDS.filter(k => text.includes(k)).length

  const max = Math.max(faqScore, orderScore, complainScore)
  if (max === 0) return 'unknown'
  if (complainScore === max) return 'complaint'
  if (orderScore === max)    return 'order'
  return 'faq'
}