import { chatAPI } from './api';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  userId: string;
  timestamp: string;
}

class ChatService {
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  async sendMessage(message: string): Promise<ChatMessage> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const response = await chatAPI.sendMessage(message, this.userId);
      
      return {
        id: `assistant-${Date.now()}`,
        text: response.message,
        sender: 'assistant',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error sending message:', error);
      // Return a fallback response
      return {
        id: `assistant-${Date.now()}`,
        text: 'I apologize, but I\'m having trouble connecting right now. Please try again later.',
        sender: 'assistant',
        timestamp: new Date(),
      };
    }
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const response = await chatAPI.getHistory(this.userId);
      
      // Transform the response to match our ChatMessage format
      return response.messages?.map((msg: any) => ({
        id: msg.id || `msg-${Date.now()}`,
        text: msg.text || msg.message,
        sender: msg.fromUser ? 'user' : 'assistant',
        timestamp: new Date(msg.timestamp || Date.now()),
      })) || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  // Helper method to create a user message
  createUserMessage(text: string): ChatMessage {
    return {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };
  }
}

export const chatService = new ChatService();
export default chatService; 