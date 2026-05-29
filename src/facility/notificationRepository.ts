import type { NotificationDataSource } from './dataSourceTypes';
import { FacilityNotification } from './types';

const NOTIFICATIONS_STORAGE_KEY = 'facility_mvp_notifications';

const parseNotifications = (raw: string | null): FacilityNotification[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as FacilityNotification[]) : [];
  } catch {
    return [];
  }
};

export const notificationRepository: NotificationDataSource = {
  list(): FacilityNotification[] {
    return parseNotifications(localStorage.getItem(NOTIFICATIONS_STORAGE_KEY));
  },

  saveAll(notifications: FacilityNotification[]) {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  },
};
