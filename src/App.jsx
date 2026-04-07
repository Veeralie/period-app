import React, { useState } from "react";

const DAY_MS = 1000 * 60 * 60 * 24;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a, b) {
  return Math.round((startOfDay(a) - startOfDay(b)) / DAY_MS);
}

function getCycleDay(date, lastPeriodStart, cycleLength) {
  const diff = diffDays(date, lastPeriodStart);
  const normalized = ((diff % cycleLength) + cycleLength) % cycleLength;
  return normalized + 1;
}

function getOvulationDay(cycleLength) {
  return Math.max(10, cycleLength - 14);
}

function getPhase(cycleDay, periodLength, ovulationDay) {
  if (cycleDay <= periodLength) return "Menstrual";
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1)
    return "Ovulation";
  if (cycleDay < ovulationDay - 1) return "Follicular";
  return "Luteal";
}

export default function App() {
  const today = startOfDay(new Date());

  const [lastPeriodStart, setLastPeriodStart] = useState(today);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [viewDate, setViewDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);

  const ovulationDay = getOvulationDay(cycleLength);
  const currentCycleDay = getCycleDay(
    selectedDate,
    lastPeriodStart,
    cycleLength
  );
  const phase = getPhase(currentCycleDay, periodLength, ovulationDay);

  const buildCalendar = () => {
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const start = addDays(first, -first.getDay());

    return Array.from({ length: 42 }, (_, i) => {
      const date = addDays(start, i);
      const cycleDay = getCycleDay(date, lastPeriodStart, cycleLength);
      const phase = getPhase(cycleDay, periodLength, ovulationDay);

      return { date, day: date.getDate(), phase };
    });
  };

  const calendar = buildCalendar();

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold">Cycle Tracker</h1>

      {/* SETTINGS */}
      <div className="mt-4 space-y-2">
        <input
          type="date"
          onChange={(e) => setLastPeriodStart(new Date(e.target.value))}
          className="text-black p-2 rounded"
        />

        <input
          type="number"
          value={cycleLength}
          onChange={(e) => setCycleLength(Number(e.target.value))}
          className="text-black p-2 rounded"
        />

        <input
          type="number"
          value={periodLength}
          onChange={(e) => setPeriodLength(Number(e.target.value))}
          className="text-black p-2 rounded"
        />
      </div>

      {/* INFO */}
      <div className="mt-4">
        <p>Cycle Day: {currentCycleDay}</p>
        <p>Phase: {phase}</p>
      </div>

      {/* CALENDAR */}
      <div className="grid grid-cols-7 gap-2 mt-4">
        {calendar.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDate(d.date)}
            style={{
              padding: 8,
              borderRadius: 8,
              border:
                selectedDate.toDateString() === d.date.toDateString()
                  ? "2px solid #d3ae91"
                  : "1px solid #333",
              background:
                d.phase === "Menstrual"
                  ? "#7f1d1d"       // red
                  : d.phase === "Follicular"
                    ? "#065f46"     // green (lighter)
                    : d.phase === "Ovulation"
                      ? "#92400e"   // gold
                      : "#022c22",  // luteal dark green
              color: "white",
            }}
        >
          {d.day}
        </button>
        ))}
      </div>
    </div>
  );
}
