import moment from "moment";

export type ActivityDay = {
  date: moment.Moment;
  isActive: boolean;
  label: string;
};

/** Last five calendar days, oldest first, with activity status. */
export function getRecentActivityDays(
  activeDays: (string | Date)[] | undefined,
): ActivityDay[] {
  const activeSet = new Set(
    (activeDays ?? []).map((date) =>
      moment(date).startOf("day").format("YYYY-MM-DD"),
    ),
  );

  return Array.from({ length: 5 }, (_, index) => {
    const offset = 4 - index;
    const date = moment().startOf("day").subtract(offset, "days");
    return {
      date,
      isActive: activeSet.has(date.format("YYYY-MM-DD")),
      label: offset === 0 ? "Today" : date.format("ddd"),
    };
  });
}

/** Consecutive active days ending today (or yesterday if today not yet active). */
export function getCurrentStreak(
  activeDays: (string | Date)[] | undefined,
): number {
  if (!activeDays?.length) return 0;

  const activeSet = new Set(
    activeDays.map((date) => moment(date).startOf("day").format("YYYY-MM-DD")),
  );

  let streak = 0;
  let day = moment().startOf("day");

  if (!activeSet.has(day.format("YYYY-MM-DD"))) {
    day = day.subtract(1, "day");
  }

  while (activeSet.has(day.format("YYYY-MM-DD"))) {
    streak += 1;
    day = day.subtract(1, "day");
  }

  return streak;
}
