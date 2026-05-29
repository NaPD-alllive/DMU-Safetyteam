import { FacilityNotification, FacilityRole } from './types';

interface NotificationActor {
  id: string;
  role: FacilityRole;
}

export const getVisibleNotifications = (
  notifications: FacilityNotification[],
  actor: NotificationActor,
) => {
  const visible = actor.role === 'admin'
    ? notifications
    : notifications.filter((item) => item.recipientId === actor.id);

  return [...visible].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const countUnreadNotifications = (notifications: FacilityNotification[]) =>
  notifications.filter((item) => !item.read).length;

export const markNotificationAsRead = (
  notifications: FacilityNotification[],
  id: string,
) => notifications.map((item) => item.id === id ? { ...item, read: true } : item);

export const markVisibleNotificationsAsRead = (
  notifications: FacilityNotification[],
  visibleNotifications: FacilityNotification[],
) => {
  const visibleIds = new Set(visibleNotifications.map((item) => item.id));
  return notifications.map((item) => visibleIds.has(item.id) ? { ...item, read: true } : item);
};
