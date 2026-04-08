



App (1).jsx
JavaScript
Put this into a canvas as a runnable HTML/JavaScript app so I can preview and edit it.


Thought for 24s
Runnable App
· html
      }

      function formatShort(date) {
        return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
      }

      function formatLong(date) {
        return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
      }

      function monthLabel(date) {
        return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
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
        if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) return "Ovulation";
        if (cycleDay < ovulationDay - 1) return "Follicular";
        return "Luteal";
      }

      function getPregnancyChance(cycleDay, ovulationDay) {
        const distance = Math.abs(cycleDay - ovulationDay);
        if (distance === 0) return { label: "High", value: 88 };
        if (distance === 1) return { label: "High", value: 76 };
        if (distance === 2) return { label: "Moderate", value: 56 };
        if (distance <= 4) return { label: "Low–Moderate", value: 28 };
        return { label: "Low", value: 8 };
      }

      function emptyLog() {
        return {
          symptoms: [],
          activities: [],
          sexualActivity: [],
          contraception: [],
          notes: "",
          hydrationGoal: 2000,
          hydrationMl: 0,
          steps: 0,
          sleep: 8,
          activeMinutes: 0,
          periodStart: false,
          periodEnd: false,
        };
      }

      function inferPhaseFromSymptoms(symptoms, cyclePhaseHint) {
        const scores = { Menstrual: 0, Follicular: 0, Ovulation: 0, Luteal: 0 };
        symptoms.forEach((symptom) => {
          Object.entries(phasePredictionWeights).forEach(([phase, weights]) => {
            if (weights.includes(symptom)) scores[phase] += 1;
          });
        });
        if (cyclePhaseHint && scores[cyclePhaseHint] !== undefined) scores[cyclePhaseHint] += 1;
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const [phase, score] = sorted[0];
        const confidence = score === 0 ? 0 : Math.min(95, 35 + score * 18);
        return {
          phase,
          label: score === 0 ? `Likely ${cyclePhaseHint.toLowerCase()} phase` : `Likely ${phase.toLowerCase()} phase`,
          confidence,
          scores,
        };
      }

      function buildCalendarDays(viewDate, lastPeriodStart, cycleLength, periodLength, logs = {}) {
        const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
        const ovulationDay = getOvulationDay(cycleLength);

        return Array.from({ length: 42 }, (_, index) => {
          const date = addDays(gridStart, index);
          const cycleDay = getCycleDay(date, lastPeriodStart, cycleLength);
          let phase = getPhase(cycleDay, periodLength, ovulationDay);
          const log = logs[dateKey(date)];
          if (log?.periodStart) phase = "Menstrual";
          if (log?.periodEnd) phase = "Follicular";
          return {
            date,
            day: date.getDate(),
            muted: date.getMonth() !== viewDate.getMonth(),
            cycleDay,
            phase,
Done — it’s in the canvas as a runnable HTML/JavaScript app.

I had to repair the uploaded JSX while converting it, because the source file had several broken/duplicated sections that would not run as-is. The canvas version keeps the same overall product and UI direction, and you can now preview and edit it directly.



