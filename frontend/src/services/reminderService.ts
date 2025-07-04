import { reminderAPI } from './api';

export interface Reminder {
  id?: string;
  message: string;
  description?: string;
  timestamp: string;
  userId: string;
  status: 'INCOMPLETE' | 'COMPLETE' | 'MISSED';
  tag?: string;
}

export interface CreateReminderRequest {
  title: string;
  description?: string;
  dateTime: string;
  userId: string;
  priority?: 'low' | 'medium' | 'high';
}

class ReminderService {
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  async createReminder(reminder: Omit<Reminder, 'id' | 'status'>): Promise<Reminder> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const response = await reminderAPI.createReminder({
        ...reminder,
        userId: this.userId,
      });
      
      return {
        ...reminder,
        id: response.id,
        status: 'INCOMPLETE',
      };
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  async getReminders(): Promise<Reminder[]> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const response = await reminderAPI.getReminders(this.userId);
      
      return response.map((reminder: any) => ({
        id: reminder.id,
        message: reminder.message,
        description: reminder.description,
        timestamp: reminder.timestamp,
        userId: reminder.userId,
        status: reminder.status,
        tag: reminder.tag,
      })) || [];
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  }

  async updateReminder(reminderId: string, updates: Partial<Reminder>): Promise<Reminder> {
    try {
      const response = await reminderAPI.updateReminder(reminderId, updates);
      
      return {
        ...response,
        dateTime: new Date(response.dateTime),
      };
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  }

  async deleteReminder(reminderId: string): Promise<void> {
    try {
      await reminderAPI.deleteReminder(reminderId);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  async markAsCompleted(reminderId: string): Promise<Reminder> {
    return this.updateReminder(reminderId, { status: 'COMPLETE' });
  }

  async markAsCancelled(reminderId: string): Promise<Reminder> {
    return this.updateReminder(reminderId, { status: 'MISSED' });
  }
}

export const reminderService = new ReminderService();
export default reminderService; 