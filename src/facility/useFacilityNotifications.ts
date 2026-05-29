import { useEffect, useMemo, useState } from 'react';
import { FACILITY_SNAPSHOT_APPLIED_EVENT } from './facilitySnapshot';
import { notificationRepository } from './notificationRepository';
import {
  countUnreadNotifications,
  getVisibleNotifications,
  markNotificationAsRead,
  markVisibleNotificationsAsRead,
} from './notificationState';
import { FacilityNotification, FacilityRole } from './types';

interface NotificationActor {
  id: string;
  role: FacilityRole;
}

export const useFacilityNotifications = (actor: NotificationActor) => {
  const [notifications, setNotifications] = useState<FacilityNotification[]>(() => notificationRepository.list());

  useEffect(() => notificationRepository.saveAll(notifications), [notifications]);

  useEffect(() => {
    const refreshNotifications = () => {
      setNotifications(notificationRepository.list());
    };

    window.addEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshNotifications);
    return () => window.removeEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshNotifications);
  }, []);

  const visibleNotifications = useMemo(() => (
    getVisibleNotifications(notifications, actor)
  ), [actor, notifications]);

  const unreadCount = countUnreadNotifications(visibleNotifications);

  const addNotification = (notification: FacilityNotification) =>
    setNotifications((previous) => [notification, ...previous]);

  const markAsRead = (id: string) =>
    setNotifications((previous) => markNotificationAsRead(previous, id));

  const markAllAsRead = () => {
    setNotifications((previous) => markVisibleNotificationsAsRead(previous, visibleNotifications));
  };

  return {
    notifications,
    visibleNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
  };
};
