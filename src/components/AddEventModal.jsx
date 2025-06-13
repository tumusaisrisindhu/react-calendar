import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function AddEventModal({
  selectedDate,
  onClose,
  onSave,
  initialData,
  onDelete,
}) {
  const isEdit = Boolean(initialData);
  const [title, setTitle] = useState(initialData?.title || "");
  const [date, setDate] = useState(dayjs(initialData?.date || selectedDate));
  const [startTime, setStartTime] = useState(initialData?.startTime || "07:00");
  const [endTime, setEndTime] = useState(initialData?.endTime || "08:00");
  const [location, setLocation] = useState(initialData?.location || "");
  const [reminder, setReminder] = useState(
    initialData?.reminder || "10 mins before"
  );
  const [repeat, setRepeat] = useState(initialData?.repeat || "none");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const handleSubmit = () => {
    const baseEvent = {
      id: initialData?.id || Date.now(), // ✅ Add this line
      title,
      startTime,
      endTime,
      location,
      reminder,
      repeat,
      notes,
      color: initialData?.color || "#007bff",
    };

    let eventsToSave = [];
    const repeatCount = 180;

    if (!isEdit) {
      if (repeat === "weekly") {
        for (let i = 0; i < repeatCount; i++) {
          eventsToSave.push({
            ...baseEvent,
            date: dayjs(date).add(i, "week").format("YYYY-MM-DD"),
          });
        }
      } else if (repeat === "daily") {
        for (let i = 0; i < repeatCount; i++) {
          eventsToSave.push({
            ...baseEvent,
            date: dayjs(date).add(i, "day").format("YYYY-MM-DD"),
          });
        }
      } else if (repeat === "monthly") {
        for (let i = 0; i < repeatCount; i++) {
          eventsToSave.push({
            ...baseEvent,
            date: dayjs(date).add(i, "month").format("YYYY-MM-DD"),
          });
        }
      } else if (repeat === "yearly") {
        for (let i = 0; i < repeatCount; i++) {
          eventsToSave.push({
            ...baseEvent,
            date: dayjs(date).add(i, "year").format("YYYY-MM-DD"),
          });
        }
      } else {
        eventsToSave.push({
          ...baseEvent,
          date: dayjs(date).format("YYYY-MM-DD"),
        });
      }

      eventsToSave.forEach((ev) => onSave(ev));
    } else {
      onSave({ ...baseEvent, date: date.format("YYYY-MM-DD") });
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEdit ? "Edit Event" : "Add Event"}</h2>

        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <div style={{ display: "flex" }}>
          <div style={{ paddingRight: "5px" }}>
            <label>Date</label>
            <input
              type="date"
              value={date.format("YYYY-MM-DD")}
              onChange={(e) => setDate(dayjs(e.target.value))}
            />
          </div>
          <div>
            <label>Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label>End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <label>Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
        <div style={{ display: "flex", gap: "50px", paddingTop: "10px" }}>
          <div>
            <label style={{ padding: "10px" }}>Reminder</label>
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            >
              <option>None</option>
              <option>5 mins before</option>
              <option>10 mins before</option>
              <option>30 mins before</option>
            </select>
          </div>
          <div>
            <label style={{ padding: "10px" }}>Repeat</label>
            <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
              <option value="none">Don't repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="modal-actions">
          {isEdit && (
            <button onClick={() => onDelete(initialData)}>Delete</button>
          )}
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={!title.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
