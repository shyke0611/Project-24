import { reminderAPI } from './api';

export interface Reminder {
  id?: string;
  userId: string;
  title: string;
  timestamp: string; // ISO string format
  description?: string;
  tags: ReminderTag[];
  status: ReminderStatus;
}

export enum ReminderTag {
  MEDICATION = 'MEDICATION',
  APPOINTMENT = 'APPOINTMENT',
  EVENT = 'EVENT',
  TASK = 'TASK',
  PERSONAL = 'PERSONAL',
  WORK = 'WORK',
  FINANCE = 'FINANCE',
  HEALTH = 'HEALTH',
  TRAVEL = 'TRAVEL',
  SOCIAL = 'SOCIAL',
  EDUCATION = 'EDUCATION',
  LEISURE = 'LEISURE',
  OTHER = 'OTHER'
}

export enum ReminderStatus {
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
  MISSED = 'MISSED'
}

export interface CreateReminderRequest {
  userId: string;
  title: string;
  timestamp: string; // ISO string
  description?: string;
  tags: ReminderTag[];
}

export interface UpdateReminderRequest {
  title?: string;
  timestamp?: string; // ISO string
  description?: string;
  tags?: ReminderTag[];
  status?: ReminderStatus;
}

export interface PaginatedRemindersResponse {
  reminders: Reminder[];
  hasMore: boolean;
  currentPage: number;
}

class ReminderService {
  private userId: string | null = null;

  setUserId(userId: string) {
    this.userId = userId;
  }

  async createReminder(reminder: CreateReminderRequest): Promise<Reminder> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const response = await reminderAPI.createReminder({
        ...reminder,
        userId: this.userId,
      });
      
      return {
        id: response.id,
        userId: response.userId,
        title: response.title,
        timestamp: response.timestamp,
        description: response.description,
        tags: response.tags,
        status: response.status,
      };
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  async getReminders(page: number = 0): Promise<PaginatedRemindersResponse> {
    if (!this.userId) {
      throw new Error('User ID not set');
    }

    try {
      const response = await reminderAPI.getReminders(this.userId, page);
      
      const reminders = response.map((reminder: any) => ({
        id: reminder.id,
        userId: reminder.userId,
        title: reminder.title,
        timestamp: reminder.timestamp,
        description: reminder.description,
        tags: reminder.tags,
        status: reminder.status,
      })) || [];

      // Backend returns 10 items per page, so if we get less than 10, there are no more pages
      const hasMore = reminders.length === 10;
      
      return {
        reminders,
        hasMore,
        currentPage: page,
      };
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return {
        reminders: [],
        hasMore: false,
        currentPage: page,
      };
    }
  }

  async updateReminder(reminderId: string, updates: UpdateReminderRequest): Promise<Reminder> {
    try {
      const response = await reminderAPI.updateReminder(reminderId, updates);
      
      return {
        id: response.id,
        userId: response.userId,
        title: response.title,
        timestamp: response.timestamp,
        description: response.description,
        tags: response.tags,
        status: response.status,
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
    return this.updateReminder(reminderId, { status: ReminderStatus.COMPLETE });
  }

  async markAsMissed(reminderId: string): Promise<Reminder> {
    return this.updateReminder(reminderId, { status: ReminderStatus.MISSED });
  }

  async markAsIncomplete(reminderId: string): Promise<Reminder> {
    return this.updateReminder(reminderId, { status: ReminderStatus.INCOMPLETE });
  }
}

export const reminderService = new ReminderService();
export default reminderService; 