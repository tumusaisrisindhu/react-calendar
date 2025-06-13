import dayjs from "dayjs";

export const getMonthDays = (currentMonth) => {
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  const startDay = startOfMonth.day(); // Sunday = 0
  const endDay = endOfMonth.day();     // Sunday = 0

  const days = [];

  // Previous month's tail days
  for (let i = 0; i < startDay; i++) {
    const date = startOfMonth.subtract(startDay - i, "day");
    days.push({ date, isCurrentMonth: false });
  }

  // Current month's days
  for (let i = 0; i < currentMonth.daysInMonth(); i++) {
    const date = startOfMonth.add(i, "day");
    days.push({ date, isCurrentMonth: true });
  }

  // Next month's leading days
  for (let i = 1; days.length % 7 !== 0; i++) {
    const date = endOfMonth.add(i, "day");
    days.push({ date, isCurrentMonth: false });
  }

  return days;
};

export const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");
