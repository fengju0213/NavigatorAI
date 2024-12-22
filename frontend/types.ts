export interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export interface Chat {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

export interface ChatState {
  isGenerating: boolean;
  canEditLastMessage: boolean;
}

