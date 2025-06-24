"use client";
import { useState } from "react";

export default function ScheduleSection({ schedule, setSchedule }) {
  const [showDateInput, setShowDateInput] = useState(false);
  const [newDate, setNewDate] = useState("");

  const [editingDate, setEditingDate] = useState(null); // Track which date is adding activity
  const [activityTime, setActivityTime] = useState("");
  const [activityName, setActivityName] = useState("");

  // Add a new date
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

  // Start adding activity to a date
  const startAddActivity = (date) => {
    setEditingDate(date);
    setActivityTime("9:00 AM"); // Default time
    setActivityName("");
  };

  // Save activity to selected date
  const saveActivity = (date) => {
    if (!activityTime.includes(":") || !activityName.trim()) return;

    setSchedule((prev) => {
      const updated = { ...prev };
      updated[date] = [
        ...updated[date],
        { time: activityTime, activity: activityName },
      ];
      return updated;
    });

    setEditingDate(null);
    setActivityTime("");
    setActivityName("");
  };

  return (
    <div className="p-5 border bg-white rounded-md shadow-md w-full">
      <h5 className="text-md font-bold mb-3">Event Schedule</h5>

      {/* Show all added dates */}
      {Object.keys(schedule).length === 0 && (
        <p className="text-gray-500 italic">No dates added yet.</p>
      )}

      {Object.keys(schedule).map((date) => (
        <div key={date} className="mb-4">
          <h6 className="font-semibold">{date}</h6>

          {/* Show activities */}
          {schedule[date].length > 0 ? (
            <ul className="list-disc ml-5 mt-2 space-y-1">
              {schedule[date].map((act, idx) => (
                <li key={idx}>
                  <strong>{act.time}</strong> - {act.activity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic ml-5">No activities added</p>
          )}

          {/* Add Activity Button */}
          {editingDate === date ? (
            <div className="ml-5 mt-2 flex flex-col gap-2 w-full sm:w-80">
              {/* Custom Time Picker */}
              <div className="flex gap-2">
                {/* Hour Selector */}
                <select
                  value={activityTime.split(" ")[0].split(":")[0] || ""}
                  onChange={(e) => {
                    const [_, minute = "00"] = activityTime.split(" ")[0].split(":");
                    const period = activityTime.split(" ")[1] || "AM";
                    const newHour = e.target.value;
                    setActivityTime(`${newHour}:${minute} ${period}`);
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

                {/* Minute Selector */}
                <select
                  value={activityTime.split(" ")[0].split(":")[1] || ""}
                  onChange={(e) => {
                    const [hour = "12"] = activityTime.split(" ")[0].split(":");
                    const period = activityTime.split(" ")[1] || "AM";
                    const newMinute = e.target.value;
                    setActivityTime(`${hour}:${newMinute} ${period}`);
                  }}
                  className="border p-2 rounded"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 60 }, (_, i) => i).map((min) => (
                    <option key={min} value={min.toString().padStart(2, "0")}>
                      {min.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>

                {/* AM/PM Selector */}
                <select
                  value={activityTime.split(" ")[1] || ""}
                  onChange={(e) => {
                    const [timePart = "12:00"] = activityTime.split(" ");
                    const period = e.target.value;
                    setActivityTime(`${timePart} ${period}`);
                  }}
                  className="border p-2 rounded focus:outline-none"
                >
                  <option value="">AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              {/* Activity Name Input */}
              <input
                type="text"
                placeholder="Activity name"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="border p-2 rounded focus:outline-none"
              />

              {/* Save & Cancel Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => saveActivity(date)}
                  className="bg-primary text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDate(null)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
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

      {/* Add Date Input Field */}
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