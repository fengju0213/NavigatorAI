export interface ChatState {
  isGenerating: boolean
  canEditLastMessage: boolean
  lastUserInput?: string
}

export interface UserProfile {
  name: string
  age: string
  mbti: string
  income: string
  companions: string
  targetCity: string
  travelDateFrom: string
  travelDateTo: string
} 