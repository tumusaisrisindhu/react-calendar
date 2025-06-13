import React, { useState } from "react";
import dayjs from "dayjs";
import CalendarHeader from "./CalendarHeader";
import DayCell from "./DayCell";
import AddEventModal from "./AddEventModal";
import { getMonthDays, formatDate } from "../utils/dateUtils";
import initialEvents from "../data/events.json";
import "../styles/calendar.css";
import { days } from "../constants/days";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("month");
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const today = dayjs();

  const groupedEvents = events.reduce((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {});

  const monthDays = getMonthDays(currentDate);

  const handlePrev = () => {
    const unit = viewMode === "week" ? "week" : viewMode;
    setCurrentDate(currentDate.subtract(1, unit));
  };

  const handleNext = () => {
    const unit = viewMode === "week" ? "week" : viewMode;
    setCurrentDate(currentDate.add(1, unit));
  };

  const handleAddEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev === selectedEvent
          ? { ...updatedEvent, color: ev.color || "#007bff" }
          : ev
      )
    );
    setSelectedEvent(null);
    setShowModal(false);
  };

  const handleDeleteEvent = (eventToDelete) => {
    setEvents((prev) => prev.filter((ev) => ev !== eventToDelete));
    setSelectedEvent(null);
    setShowModal(false);
  };

  const renderCalendarView = () => {
    const onEventClick = (ev) => {
      setSelectedEvent(ev);
      setShowModal(true);
    };

    const props = { today, onEventClick };

    if (viewMode === "day") {
      const key = formatDate(currentDate);
      return (
        <div className="calendar-grid single-day">
          <DayCell
            date={currentDate}
            events={groupedEvents[key]}
            isCurrentMonth={true}
            {...props}
          />
        </div>
      );
    }

    if (viewMode === "week") {
      const startOfWeek = currentDate.startOf("week");
      const weekDates = Array.from({ length: 7 }, (_, i) =>
        startOfWeek.add(i, "day")
      );
      return (
        <div className="calendar-grid">
          {weekDates.map((date, idx) => (
            <DayCell
              key={idx}
              date={date}
              events={groupedEvents[formatDate(date)]}
              isCurrentMonth={true}
              {...props}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="calendar-grid">
        {monthDays.map((obj, idx) => (
          <DayCell
            key={idx}
            date={obj.date}
            events={groupedEvents[obj.date ? formatDate(obj.date) : ""]}
            isCurrentMonth={obj.isCurrentMonth}
            {...props}
          />
        ))}
      </div>
    );
  };

  const renderHeaderText = () => {
    if (viewMode === "day") return currentDate.format("MMMM D, YYYY");
    if (viewMode === "week") {
      const start = currentDate.startOf("week");
      const end = currentDate.endOf("week");
      return `${currentDate.format("YYYY")}, ${start.format(
        "MMMM D"
      )} - ${end.format("D")}`;
    }
    return `${currentDate.format("YYYY")} ${currentDate.format("MMMM")}`;
  };

  return (
    <div className="calendar">
      <div className="add-event">
        <button
          className="add-event-button"
          onClick={() => {
            setSelectedEvent(null);
            setShowModal(true);
          }}
        >
          + Add Event
        </button>
      </div>
      <div className="calendar-toolbar">
        <div className="left-controls">
          <div className="nav-buttons">
            <button onClick={handlePrev}>❮</button>
            <button onClick={handleNext}>❯</button>
          </div>
          <h2>{renderHeaderText()}</h2>
        </div>
        <div className="right-controls">
          <div className="view-mode-buttons">
            {["day", "week", "month"].map((mode) => (
              <button
                key={mode}
                className={viewMode === mode ? "active" : ""}
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode !== "day" && (
        <div className="day-names">
          {days.map((d) => (
            <div key={d} className="day-name">
              {d}
            </div>
          ))}
        </div>
      )}

      {renderCalendarView()}

      {showModal && (
        <AddEventModal
          selectedDate={currentDate}
          onClose={() => {
            setSelectedEvent(null);
            setShowModal(false);
          }}
          onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
          onDelete={handleDeleteEvent}
          initialData={selectedEvent}
        />
      )}
    </div>
  );
}
