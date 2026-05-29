import { Facility, FacilityReservation } from './types';

export interface MonthlyReservationStat {
  key: string;
  label: string;
  count: number;
}

export interface FacilityDashboardStats {
  todayReservationCount: number;
  facilityUtilizationRate: number;
  monthlyReservationStats: MonthlyReservationStat[];
}

const ACTIVE_RESERVATION_STATUSES = ['pending', 'approved'];

const toMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const isSameDate = (value: string, target: Date) => {
  const date = new Date(value);
  return date.toDateString() === target.toDateString();
};

const getRecentMonths = (now: Date, size: number): MonthlyReservationStat[] =>
  Array.from({ length: size }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (size - 1 - index), 1);
    return {
      key: toMonthKey(date),
      label: `${date.getMonth() + 1}월`,
      count: 0,
    };
  });

const isActiveReservation = (reservation: FacilityReservation) =>
  ACTIVE_RESERVATION_STATUSES.includes(reservation.status);

const calculateUtilizationRate = (
  facilities: Facility[],
  reservations: FacilityReservation[],
  now: Date,
) => {
  if (facilities.length === 0) return 0;
  const monthKey = toMonthKey(now);
  const usedFacilityIds = new Set(
    reservations
      .filter((reservation) => isActiveReservation(reservation) && toMonthKey(new Date(reservation.startAt)) === monthKey)
      .map((reservation) => reservation.facilityId)
  );
  return Math.round((usedFacilityIds.size / facilities.length) * 100);
};

export const buildFacilityDashboardStats = (
  facilities: Facility[],
  reservations: FacilityReservation[],
  now = new Date(),
): FacilityDashboardStats => {
  const months = getRecentMonths(now, 6);
  const monthMap = new Map(months.map((month) => [month.key, month]));

  reservations.filter(isActiveReservation).forEach((reservation) => {
    const item = monthMap.get(toMonthKey(new Date(reservation.startAt)));
    if (item) item.count += 1;
  });

  return {
    todayReservationCount: reservations.filter((item) => isActiveReservation(item) && isSameDate(item.startAt, now)).length,
    facilityUtilizationRate: calculateUtilizationRate(facilities, reservations, now),
    monthlyReservationStats: months,
  };
};
