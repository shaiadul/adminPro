"use client";
import { useState } from "react";

export default function ScheduleSection({ schedule, setSchedule }) {
  const [showDateInput, setShowDateInput] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [editingDate, setEditingDate] = useState(null);
  const [activityTime, setActivityTime] = useState("");
  const [activityName, setActivityName] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddDate = () => {
    if (newDate && !schedule[newDate]) {
      setSchedule((prev) => ({
        ...prev,
        [newDate]: [],
      }));
    }
    setNewDate("");
    setShowDateInput(false);
  };

  const startAddActivity = (date, index = null, act = null) => {
    setEditingDate(date);
    setEditIndex(index);
    if (act) {
      setActivityTime(act.time);
      setActivityName(act.activity);
    } else {
      setActivityTime("9:00 AM");
      setActivityName("");
    }
  };

  const saveActivity = (date) => {
    if (!activityTime.includes(":") || !activityName.trim()) return;

    setSchedule((prev) => {
      const updated = { ...prev };
      const dayActivities = [...updated[date]];

      if (editIndex !== null) {
        // Update existing
        dayActivities[editIndex] = {
          time: activityTime,
          activity: activityName,
        };
      } else {
        // Add new
        dayActivities.push({ time: activityTime, activity: activityName });
      }

      updated[date] = dayActivities;
      return updated;
    });

    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingDate(null);
    setEditIndex(null);
    setActivityTime("");
    setActivityName("");
  };

  const deleteActivity = (date, index) => {
    setSchedule((prev) => {
      const updated = { ...prev };
      updated[date] = updated[date].filter((_, i) => i !== index);
      // Optional: remove date if no activities left
      if (updated[date].length === 0) delete updated[date];
      return updated;
    });
  };

  return (
    <div className="p-5 border bg-white rounded-md shadow-md w-full">
      <h5 className="text-md font-bold mb-3">Event Schedule</h5>

      {schedule && Object.keys(schedule).length === 0 && (
        <p className="text-gray-500 italic">No dates added yet.</p>
      )}

      {schedule && Object?.keys(schedule).map((date) => (
        <div key={date} className="mb-4">
          <h6 className="font-semibold">{date}</h6>

          {/* Activities List */}
          {schedule[date].length > 0 ? (
            <ul className="ml-5 mt-2 space-y-1">
              {schedule[date].map((act, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2"
                >
                  <div>
                    <strong>{act.time}</strong> - {act.activity}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startAddActivity(date, idx, act)}
                      className="text-primary text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteActivity(date, idx)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic ml-5">No activities added</p>
          )}

          {/* Add/Edit Activity Form */}
          {editingDate === date && (
            <div className="ml-5 mt-2 flex flex-col gap-2 w-full sm:w-80">
              {/* Time Pickers */}
              <div className="flex gap-2">
                <select
                  value={activityTime.split(" ")[0]?.split(":")[0] || ""}
                  onChange={(e) => {
                    const [, minute = "00"] = activityTime
                      .split(" ")[0]
                      ?.split(":");
                    const period = activityTime.split(" ")[1] || "AM";
                    const hour = e.target.value;
                    setActivityTime(`${hour}:${minute} ${period}`);
                  }}
                  className="border p-2 rounded"
                >
                  <option value="">HH</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>

                <select
                  value={activityTime.split(" ")[0]?.split(":")[1] || ""}
                  onChange={(e) => {
                    const [hour = "12"] = activityTime
                      .split(" ")[0]
                      ?.split(":");
                    const period = activityTime.split(" ")[1] || "AM";
                    const minute = e.target.value;
                    setActivityTime(`${hour}:${minute} ${period}`);
                  }}
                  className="border p-2 rounded"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 60 }, (_, i) =>
                    i.toString().padStart(2, "0")
                  ).map((min) => (
                    <option key={min} value={min}>
                      {min}
                    </option>
                  ))}
                </select>

                <select
                  value={activityTime.split(" ")[1] || ""}
                  onChange={(e) => {
                    const [timePart = "12:00"] = activityTime.split(" ");
                    setActivityTime(`${timePart} ${e.target.value}`);
                  }}
                  className="border p-2 rounded"
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Activity name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="border p-2 rounded"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => saveActivity(date)}
                  className="bg-primary text-white px-3 py-1 rounded"
                >
                  {editIndex !== null ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Show add new activity if not editing */}
          {editingDate !== date && (
            <button
              type="button"
              onClick={() => startAddActivity(date)}
              className="mt-2 text-primary underline text-sm"
            >
              + Add Activity
            </button>
          )}
        </div>
      ))}

      {/* Add Date */}
      {showDateInput ? (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddDate}
              className="bg-primary text-white px-3 py-1 rounded"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowDateInput(false)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowDateInput(true)}
          className="mt-4 text-primary underline"
        >
          + Add New Date
        </button>
      )}
    </div>
  );
}
