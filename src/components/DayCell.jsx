import React from "react";
import dayjs from "dayjs";

export default function DayCell({
  date,
  today,
  events,
  isCurrentMonth,
  onEventClick,
}) {
  const isToday = date && dayjs(date).isSame(today, "day");
  const day = date ? dayjs(date) : null;

  return (
    <div
      className={`day-cell ${isToday ? "today" : ""} ${
        !isCurrentMonth ? "dimmed" : ""
      }`}
    >
      <div className="day-number">{day ? String(day.date()) : ""}</div>
      <div className="event-list">
        {events?.map((ev, i) => (
          <div
            key={i}
            className="event"
            style={{ backgroundColor: ev.color }}
            onClick={() => onEventClick(ev)}
          >
            <span>{ev.title}</span>
            <span className="time">
              {ev.startTime} - {ev.endTime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
