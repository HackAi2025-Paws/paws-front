export interface Suggestion {
  id: string
  text: string
  category: string
  priority: 'high' | 'medium' | 'low'
  confidence?: number
  source?: string
}