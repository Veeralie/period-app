import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cycle-wellness-dynamic-v1";
const DAY_MS = 1000 * 60 * 60 * 24;

const phaseMeta = {
  Menstrual: {
    emoji: "🩸",
    title: "Menstrual phase",
    subtitle: "Focus on rest, recovery, hydration, and reducing inflammation.",
    badge: "bg-rose-200/20 text-rose-100 border border-rose-200/20",
    accent: "from-rose-400/30 to-rose-200/10",
    recommendations: [
      "Prioritize sleep, mobility, and lighter movement.",
      "Hydrate well and favor iron-rich meals.",
      "Reduce inflammation with warm meals and lower intensity days.",
    ],
  },
  Follicular: {
    emoji: "🌱",
    title: "Follicular phase",
    subtitle: "Focus on fat loss, productivity, and building habits.",
    badge: "bg-green-200/20 text-green-100 border border-green-200/20",
    accent: "from-green-400/30 to-emerald-200/10",
    recommendations: [
      "Use rising energy for training consistency.",
      "Lean into planning, structure, and habit stacking.",
      "Support body composition goals with protein and steps.",
    ],
  },
  Ovulation: {
    emoji: "🌸",
    title: "Ovulation phase",
    subtitle: "Focus on performance, hydration, and inflammation control.",
    badge: "bg-amber-200/20 text-amber-100 border border-amber-200/20",
    accent: "from-amber-300/30 to-yellow-100/10",
    recommendations: [
      "Take advantage of peak energy and confidence.",
      "Hydrate intentionally before and after exercise.",
      "Keep recovery and inflammation control in check.",
    ],
  },
  Luteal: {
    emoji: "🌙",
    title: "Luteal phase",
    subtitle: "Focus on cortisol control, appetite control, and hormone balance.",
    badge: "bg-violet-200/20 text-violet-100 border border-violet-200/20",
    accent: "from-violet-400/30 to-purple-200/10",
    recommendations: [
      "Lower stress load and protect recovery time.",
      "Support appetite with protein, fiber, and regular meals.",
      "Adjust training intensity when energy starts to dip.",
    ],
  },
};

const phaseClasses = {
  Menstrual: "bg-rose-300/25 text-white",
  Follicular: "bg-green-300/25 text-white",
  Ovulation: "bg-amber-300/25 text-white",
  Luteal: "bg-violet-300/25 text-white",
};

const sexualActivityOptions = ["Unprotected sex", "Protected sex", "Masturbation", "Kissing"];

const contraceptionOptions = [
  "None",
  "Condom",
  "Birth control pill",
  "Patch",
  "Injection",
  "IUD",
  "Implant",
  "Emergency contraception",
];

const expectedSymptomsByCategory = {
  Body: ["Mild cramping", "One-sided pelvic pain", "Breast sensitivity"],
  Discharge: ["Watery cervical mucus", "Clear stretchy mucus", "Egg-white mucus"],
  Cervix: ["Cervix feels higher", "Cervix feels softer", "Cervix feels more open"],
  General: ["More energy"],
  Libido: ["Increased libido"],
};

const symptomGroups = [
  {
    title: "Premenstrual",
    items: [
      "Cramps",
      "Pelvic heaviness",
      "Lower back pain",
      "Bloating",
      "Breast tenderness",
      "Swollen breasts",
      "Acne breakouts",
      "Food cravings",
      "Increased appetite",
      "Fatigue",
      "Insomnia",
      "Poor sleep",
      "Irritability",
      "Anxiety",
      "Mood swings",
      "Crying spells",
      "Headache",
      "Migraine",
      "Constipation",
      "Diarrhea",
      "Spotting",
    ],
  },
  {
    title: "Ovulation",
    items: [
      "One-sided pelvic pain",
      "Mild cramping",
      "Increased libido",
      "More energy",
      "Breast sensitivity",
      "Light spotting",
      "Wet sensation",
      "Slippery sensation",
      "Watery cervical mucus",
      "Clear stretchy mucus",
      "Egg-white mucus",
      "Cervix feels higher",
      "Cervix feels softer",
      "Cervix feels more open",
    ],
  },
  {
    title: "Post-menstrual",
    items: [
      "Dry days",
      "Very little discharge",
      "Sticky discharge",
      "Mild energy rebound",
      "Reduced bloating",
      "Fewer cramps",
      "Stable mood",
      "Clearer skin",
      "Lower appetite swings",
    ],
  },
  {
    title: "Positive pregnancy",
    items: [
      "Missed period",
      "Nausea",
      "Vomiting",
      "Food aversions",
      "Food cravings",
      "Increased smell sensitivity",
      "Taste changes",
      "Breast pain",
      "Breast fullness",
      "Fatigue",
      "Frequent urination",
      "Heartburn",
      "Appetite changes",
      "Mild cramping",
      "Milky discharge",
      "Feeling fetal movement",
      "Round ligament pain",
      "Pregnancy glow",
    ],
  },
  {
    title: "Emotion",
    items: [
      "Emotional sensitivity",
      "Feeling overwhelmed",
      "Feeling detached",
      "Stress",
      "Calmness",
      "Feeling affectionate",
      "Feeling emotionally numb",
      "Need for reassurance",
      "Social sensitivity",
      "Easily upset",
    ],
  },
  {
    title: "Head",
    items: [
      "Headache",
      "Migraine",
      "Dizziness",
      "Lightheadedness",
      "Brain fog",
      "Poor focus",
      "Mental fatigue",
      "Sinus pressure",
      "Sensitivity to light",
      "Sensitivity to sound",
    ],
  },
  {
    title: "Face",
    items: [
      "Acne",
      "Oily skin",
      "Dry skin",
      "Puffy face",
      "Flushed face",
      "Tender skin",
      "Chapped lips",
      "Jawline breakouts",
      "Forehead breakouts",
      "Dull skin",
    ],
  },
  {
    title: "Body",
    items: [
      "Pelvic pain",
      "Uterine cramps",
      "Back pain",
      "Breast tenderness",
      "Breast swelling",
      "Muscle aches",
      "Joint pain",
      "Body heaviness",
      "Hot flashes",
      "Chills",
      "Tender abdomen",
      "Hip pain",
    ],
  },
  {
    title: "Digestion",
    items: [
      "Nausea",
      "Vomiting",
      "Bloating",
      "Gas",
      "Constipation",
      "Diarrhea",
      "Heartburn",
      "Appetite increase",
      "Appetite decrease",
      "Food cravings",
      "Food aversions",
      "Stomach pain",
    ],
  },
  {
    title: "General",
    items: [
      "Fatigue",
      "Low energy",
      "High energy",
      "Poor sleep",
      "Restless sleep",
      "Insomnia",
      "Feverish feeling",
      "Feeling run down",
      "Weight fluctuation",
      "Low motivation",
      "Good productivity",
      "Exercise felt easier",
      "Exercise felt harder",
    ],
  },
  {
    title: "Libido",
    items: [
      "Higher libido",
      "Lower libido",
      "More arousal",
      "Less arousal",
      "More sexual thoughts",
      "Less interest in touch",
      "Comfortable sex",
      "Painful sex",
      "Easier orgasm",
      "Harder orgasm",
    ],
  },
  {
    title: "Cervix",
    items: [
      "High",
      "Medium",
      "Low",
      "Soft",
      "Medium firmness",
      "Firm",
      "Open",
      "Slightly open",
      "Closed",
      "Hard to reach",
      "Easy to reach",
    ],
  },
  {
    title: "Discharge",
    items: [
      "Dry",
      "Sticky",
      "Tacky",
      "Creamy",
      "Lotion-like",
      "Wet",
      "Watery",
      "Slippery",
      "Clear",
      "Cloudy",
      "Stretchy",
      "Egg-white",
      "Thick",
      "Milky",
      "Yellowish",
      "Spotting",
      "Blood-tinged",
      "Odor change",
    ],
  },
  {
    title: "Mood",
    items: [
      "Happy",
      "Neutral",
      "Calm",
      "Irritable",
      "Angry",
      "Sad",
      "Low mood",
      "Anxious",
      "Moody",
      "Motivated",
      "Restless",
      "Social",
      "Withdrawn",
      "Confident",
      "Insecure",
    ],
  },
];

const phasePredictionWeights = {
  Menstrual: [
    "Cramps",
    "Pelvic heaviness",
    "Lower back pain",
    "Uterine cramps",
    "Breast tenderness",
    "Fatigue",
    "Low energy",
    "Spotting",
  ],
  Follicular: [
    "Dry days",
    "Very little discharge",
    "Sticky discharge",
    "Mild energy rebound",
    "Stable mood",
    "Clearer skin",
    "Good productivity",
  ],
  Ovulation: [
    "One-sided pelvic pain",
    "Wet sensation",
    "Slippery sensation",
    "Watery cervical mucus",
    "Clear stretchy mucus",
    "Egg-white mucus",
    "Higher libido",
    "More energy",
    "High",
    "Soft",
    "Open",
  ],
  Luteal: [
    "Bloating",
    "Food cravings",
    "Increased appetite",
    "Breast swelling",
    "Mood swings",
    "Irritability",
    "Poor sleep",
    "Body heaviness",
  ],
  Pregnancy: [
    "Missed period",
    "Nausea",
    "Vomiting",
    "Frequent urination",
    "Milky discharge",
    "Breast fullness",
    "Food aversions",
    "Pregnancy glow",
  ],
};

const phasePremiumLinks = {
  Menstrual: {
    exercise: {
      text: "Light yoga, stretching, recovery walks",
      link: "https://yourapp.com/menstrual-workout",
      cta: "View workout",
    },
    supplements: {
      text: "Iron support, magnesium, omega-3",
      link: "https://yourapp.com/supplements-menstrual",
      cta: "View supplements",
    },
    diet: {
      text: "Warm meals, iron-rich foods, hydration",
      link: "https://yourapp.com/menstrual-meal-plan",
      cta: "View meal plan",
    },
  },
  Follicular: {
    exercise: {
      text: "Strength training, Pilates, progressive sessions",
      link: "https://yourapp.com/follicular-workout",
      cta: "View workout",
    },
    supplements: {
      text: "B-vitamins, probiotics, creatine",
      link: "https://yourapp.com/supplements-follicular",
      cta: "View supplements",
    },
    diet: {
      text: "Fresh meals, lean protein, high fiber",
      link: "https://yourapp.com/follicular-meal-plan",
      cta: "View meal plan",
    },
  },
  Ovulation: {
    exercise: {
      text: "Higher intensity training, performance workouts",
      link: "https://yourapp.com/ovulation-workout",
      cta: "View workout",
    },
    supplements: {
      text: "Antioxidants, magnesium, electrolytes",
      link: "https://yourapp.com/supplements-ovulation",
      cta: "View supplements",
    },
    diet: {
      text: "Balanced plates, hydration, antioxidant foods",
      link: "https://yourapp.com/ovulation-meal-plan",
      cta: "View meal plan",
    },
  },
  Luteal: {
    exercise: {
      text: "Moderate training, walking",
      link: "https://yourapp.com/luteal-workout",
      cta: "View workout",
    },
    supplements: {
      text: "Myo-inositol, Magnesium, Berberine",
      link: "https://yourapp.com/supplements-luteal",
      cta: "Shop supplements",
    },
    diet: {
      text: "Higher carbs, high protein",
      link: "https://yourapp.com/luteal-meal-plan",
      cta: "View meal plan",
    },
  },
};

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(date) {
  return startOfDay(date).toISOString().slice(0, 10);
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
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) return "Ovulation";
  if (cycleDay < ovulationDay - 1) return "Follicular";
  return "Luteal";
}

function getPregnancyChance(cycleDay, ovulationDay) {
  const distance = Math.abs(cycleDay - ovulationDay);
  if (distance === 0) return { label: "High", value: 88, note: "Around predicted ovulation." };
  if (distance === 1) return { label: "High", value: 76, note: "Within the most fertile window." };
  if (distance === 2) return { label: "Moderate", value: 56, note: "Fertility may still be elevated." };
  if (distance <= 4) return { label: "Low–Moderate", value: 28, note: "Possible but lower than peak fertility days." };
  return { label: "Low", value: 8, note: "Outside the predicted fertile window." };
}

function buildCalendarDays(viewDate, lastPeriodStart, cycleLength, periodLength) {
  const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const ovulationDay = getOvulationDay(cycleLength);
  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    const cycleDay = getCycleDay(date, lastPeriodStart, cycleLength);
    const phase = getPhase(cycleDay, periodLength, ovulationDay);
    return {
      date,
      day: date.getDate(),
      muted: date.getMonth() !== viewDate.getMonth(),
      cycleDay,
      phase,
      fertile: cycleDay >= ovulationDay - 4 && cycleDay <= ovulationDay + 1,
      ovulation: cycleDay === ovulationDay,
    };
  });
}

function inferPhaseFromSymptoms(symptoms) {
  const scores = Object.fromEntries(Object.keys(phasePredictionWeights).map((key) => [key, 0]));
  symptoms.forEach((symptom) => {
    Object.entries(phasePredictionWeights).forEach(([phase, weights]) => {
      if (weights.includes(symptom)) scores[phase] += 1;
    });
  });
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [best, score] = entries[0] || ["Menstrual", 0];
  const totalSelected = Math.max(1, symptoms.length);
  return {
    label: score === 0 ? "Not enough symptom data yet" : `Likely ${best.toLowerCase()} timing`,
    confidence: score === 0 ? 0 : Math.min(96, Math.round((score / totalSelected) * 100)),
  };
}

function emptyLog() {
  return {
    symptoms: [],
    sexualActivity: [],
    contraception: [],
    notes: "",
    periodStart: false,
    periodEnd: false,
  };
}

export default function CycleWellnessPage() {
  const today = startOfDay(new Date());
  const defaultLastPeriod = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return dateKey(d);
  }, []);

  const [lastPeriodStart, setLastPeriodStart] = useState(defaultLastPeriod);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewDate, setViewDate] = useState(today);
  const [logs, setLogs] = useState({});
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.lastPeriodStart) setLastPeriodStart(parsed.lastPeriodStart);
      if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
      if (parsed.periodLength) setPeriodLength(parsed.periodLength);
      if (parsed.logs) setLogs(parsed.logs);
      if (parsed.selectedDate) setSelectedDate(startOfDay(parsed.selectedDate));
      if (parsed.viewDate) setViewDate(startOfDay(parsed.viewDate));
    } catch (error) {
      console.error("Failed to restore saved data", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lastPeriodStart,
        cycleLength,
        periodLength,
        logs,
        selectedDate: dateKey(selectedDate),
        viewDate: dateKey(viewDate),
      })
    );
  }, [lastPeriodStart, cycleLength, periodLength, logs, selectedDate, viewDate]);

  const learnedHistoryCount = useMemo(() => {
    return Object.values(logs).filter((entry) => entry?.periodStart).length;
  }, [logs]);

  const lastPeriodDateObj = startOfDay(lastPeriodStart);
  const currentCycleDay = getCycleDay(today, lastPeriodDateObj, cycleLength);
  const ovulationDay = getOvulationDay(cycleLength);
  const currentPhaseName = getPhase(currentCycleDay, periodLength, ovulationDay);
  const currentPhase = phaseMeta[currentPhaseName];
  const premiumLinks = phasePremiumLinks[currentPhaseName];

  const selectedCycleDay = getCycleDay(selectedDate, lastPeriodDateObj, cycleLength);
  const selectedPhaseName = getPhase(selectedCycleDay, periodLength, ovulationDay);
  const selectedChance = getPregnancyChance(selectedCycleDay, ovulationDay);
  const selectedLog = logs[dateKey(selectedDate)] || emptyLog();
  const inference = inferPhaseFromSymptoms(selectedLog.symptoms);

  const nextPeriodStart = useMemo(() => {
    let next = new Date(lastPeriodDateObj);
    while (startOfDay(next) <= today) next = addDays(next, cycleLength);
    return next;
  }, [lastPeriodDateObj, cycleLength, today]);

  const ovulationDate = addDays(nextPeriodStart, -(cycleLength - ovulationDay));
  const fertileStart = addDays(ovulationDate, -4);
  const fertileEnd = addDays(ovulationDate, 1);

  const insights = {
    ovulation: formatShort(ovulationDate),
    fertileWindow: `${formatShort(fertileStart)} – ${formatShort(fertileEnd)}`,
    nextPeriod: formatShort(nextPeriodStart),
    pregnancyChanceLabel: getPregnancyChance(currentCycleDay, ovulationDay).label,
    pregnancyChanceValue: getPregnancyChance(currentCycleDay, ovulationDay).value,
    pregnancyChanceNote: getPregnancyChance(currentCycleDay, ovulationDay).note,
  };

  const calendarDays = useMemo(
    () => buildCalendarDays(viewDate, lastPeriodDateObj, cycleLength, periodLength),
    [viewDate, lastPeriodDateObj, cycleLength, periodLength]
  );

  function updateLogForDate(key, updater) {
    setLogs((prev) => {
      const current = prev[key] || emptyLog();
      return { ...prev, [key]: updater(current) };
    });
  }

  function toggleItem(section, item) {
    const key = dateKey(selectedDate);
    updateLogForDate(key, (current) => {
      const exists = current[section].includes(item);
      return {
        ...current,
        [section]: exists ? current[section].filter((value) => value !== item) : [...current[section], item],
      };
    });
  }

  function updateNotes(value) {
    const key = dateKey(selectedDate);
    updateLogForDate(key, (current) => ({ ...current, notes: value }));
  }

  function markPeriodStart(date) {
    const key = dateKey(date);
    setLastPeriodStart(key);
    updateLogForDate(key, (current) => ({ ...current, periodStart: true, periodEnd: false }));
  }

  function markPeriodEnd(date) {
    const key = dateKey(date);
    updateLogForDate(key, (current) => ({ ...current, periodEnd: true }));
  }

  const selectedDetails = {
    cycleDay: selectedCycleDay,
    fertility: selectedCycleDay >= ovulationDay - 4 && selectedCycleDay <= ovulationDay + 1 ? "Fertile window" : "Lower fertility window",
    ovulationStatus:
      selectedCycleDay < ovulationDay
        ? "Ovulation approaching"
        : selectedCycleDay === ovulationDay
          ? "Predicted ovulation"
          : "Past predicted ovulation",
    pregnancyChance: `${selectedChance.label} chance of pregnancy`,
    pregnancyChanceValue: selectedChance.value,
    inferredPhaseLabel: inference.label,
    inferredConfidence: inference.confidence,
  };

  return (
    <main className="min-h-screen bg-[#131217] text-white">
      <div className="mx-auto max-w-md px-4 py-6">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#34243a] via-[#241d30] to-[#1a1824] p-5 shadow-2xl">
          <div className={`inline-flex rounded-full px-4 py-2 text-sm font-medium backdrop-blur ${currentPhase.badge}`}>
            {currentPhase.title}
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/55">Did your period start?</p>
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                <button
                  onClick={() => markPeriodStart(today)}
                  className="rounded-full bg-[#d3ae91] px-5 py-3 text-sm font-semibold text-[#2b1e1b] shadow-lg shadow-[#d3ae91]/20 transition hover:scale-[1.01]"
                >
                  Today
                </button>
                <button
                  onClick={() => markPeriodStart(selectedDate)}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
                >
                  Backtrack date
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Cycle day</p>
                <p className="mt-2 text-4xl font-bold">Day {currentCycleDay}</p>
              </div>
              <div className={`rounded-3xl bg-gradient-to-br p-4 ring-1 ring-white/10 ${currentPhase.accent}`}>
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Auto-detected</p>
                <p className="mt-2 text-2xl font-bold">{currentPhase.emoji} {currentPhaseName}</p>
              </div>
            </div>

            <p className="text-[1.05rem] leading-8 text-white/75">{currentPhase.subtitle}</p>
            <p className="text-sm text-white/45">
              Personalized after {Math.max(0, 3 - learnedHistoryCount)} more logged cycle{Math.max(0, 3 - learnedHistoryCount) === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
          <h2 className="text-2xl font-bold">Cycle setup</h2>
          <p className="mt-1 text-sm text-white/55">Update your cycle settings so the calendar, phase, and predictions stay personalized.</p>
          <div className="mt-4 grid gap-3">
            <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-sm text-white/55">Last period start</span>
              <input
                type="date"
                value={lastPeriodStart}
                onChange={(e) => setLastPeriodStart(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-sm text-white/55">Cycle length</span>
                <input
                  type="number"
                  min="21"
                  max="40"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value) || 28)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                />
              </label>
              <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-sm text-white/55">Period length</span>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(Number(e.target.value) || 5)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Cycle insights</h2>
              <p className="mt-1 text-sm text-white/55">
                Predictions based on your {cycleLength}-day cycle and saved period history.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <InsightCard label="Ovulation" value={insights.ovulation} />
            <InsightCard label="Fertile window" value={insights.fertileWindow} />
            <InsightCard label="Next period" value={insights.nextPeriod} />
          </div>

          <div className="mt-4 rounded-[1.75rem] border border-white/10 bg-black/20 p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Chance of pregnancy</p>
                <p className="text-2xl font-bold">{insights.pregnancyChanceLabel}</p>
              </div>
              <div className="text-3xl font-semibold">{insights.pregnancyChanceValue}%</div>
            </div>
            <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-300 to-pink-300" style={{ width: `${insights.pregnancyChanceValue}%` }} />
            </div>
            <p className="mt-4 text-sm text-white/60">{insights.pregnancyChanceNote}</p>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{currentPhase.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold">Recommendations for your phase</h2>
              <p className="text-sm text-white/55">Tailored guidance based on your detected cycle phase.</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {currentPhase.recommendations.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/85">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">Guided plans for this phase</h3>
                <p className="mt-1 text-sm text-white/55">Open deeper workout, supplement, and nutrition guidance based on your current cycle phase.</p>
              </div>
            </div>
            <div className="grid gap-3">
              <PremiumRecommendationCard
                eyebrow="Featured workout"
                title={premiumLinks.exercise.text}
                href={premiumLinks.exercise.link}
                cta={premiumLinks.exercise.cta}
              />
              <PremiumRecommendationCard
                eyebrow="Featured supplements"
                title={premiumLinks.supplements.text}
                href={premiumLinks.supplements.link}
                cta={premiumLinks.supplements.cta}
              />
              <PremiumRecommendationCard
                eyebrow="Featured nutrition"
                title={premiumLinks.diet.text}
                href={premiumLinks.diet.link}
                cta={premiumLinks.diet.cta}
              />
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Cycle calendar</h2>
              <p className="mt-1 text-sm text-white/55">Color-coded by cycle phase with clickable date logging.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                ←
              </button>
              <div className="rounded-2xl bg-white/5 px-4 py-2 text-lg font-semibold">{monthLabel(viewDate)}</div>
              <button
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                →
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-2">
            {calendarDays.map((item, index) => {
              const base = item.muted ? "bg-white/[0.03] text-white/35" : phaseClasses[item.phase] || "bg-white/[0.03] text-white";
              const active = dateKey(item.date) === dateKey(today) ? "ring-2 ring-white scale-[1.02]" : "ring-1 ring-white/5";
              const fertile = item.fertile ? "shadow-[0_0_0_1px_rgba(255,209,102,0.45)]" : "";
              const ovulation = item.ovulation ? "after:absolute after:bottom-2 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-white" : "";
              const nextPeriodMark = dateKey(item.date) >= dateKey(nextPeriodStart) && dateKey(item.date) <= dateKey(addDays(nextPeriodStart, periodLength - 1)) ? "border border-rose-300/60" : "";
              const selected = dateKey(item.date) === dateKey(selectedDate) ? "ring-2 ring-[#d3ae91] shadow-lg shadow-[#d3ae91]/20" : "";

              return (
                <button
                  key={`${item.day}-${index}`}
                  onClick={() => setSelectedDate(item.date)}
                  className={`relative h-12 rounded-2xl text-base font-semibold transition hover:scale-[1.02] ${base} ${active} ${fertile} ${ovulation} ${nextPeriodMark} ${selected}`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Legend color="bg-rose-300" label="Menstrual" />
            <Legend color="bg-green-300" label="Follicular" />
            <Legend color="bg-amber-300" label="Ovulation" />
            <Legend color="bg-violet-300" label="Luteal" />
          </div>

          <div className="mt-5 rounded-[1.75rem] border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white/55">Selected date</p>
                <h3 className="mt-1 text-2xl font-bold">{formatLong(selectedDate)}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => markPeriodStart(selectedDate)} className="rounded-full bg-[#d3ae91] px-4 py-2 text-sm font-semibold text-[#2b1e1b]">
                  Edit as period start
                </button>
                <button onClick={() => markPeriodEnd(selectedDate)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85">
                  Edit as period end
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoPill label="Day of cycle" value={`Day ${selectedDetails.cycleDay}`} />
              <InfoPill label="Fertility" value={selectedDetails.fertility} />
              <InfoPill label="Ovulation" value={selectedDetails.ovulationStatus} />
              <InfoPill label="Pregnancy chance" value={selectedDetails.pregnancyChance} />
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-200 via-pink-300 to-violet-300" style={{ width: `${selectedDetails.pregnancyChanceValue}%` }} />
            </div>

            <div className="mt-4 rounded-2xl border border-[#d3ae91]/25 bg-[#d3ae91]/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-white/55">Predicted from selected symptoms</p>
                  <p className="mt-1 text-lg font-semibold">{selectedDetails.inferredPhaseLabel}</p>
                </div>
                <div className="rounded-full bg-black/20 px-3 py-1 text-sm font-medium text-white/85">
                  {selectedDetails.inferredConfidence}% confidence
                </div>
              </div>
              <p className="mt-3 text-sm text-white/65">
                This estimate now updates based on the symptoms you save for the selected date.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <EntrySection
              title="Sexual activity"
              subtitle="Log the type of activity recorded on this date."
              items={sexualActivityOptions}
              selectedItems={selectedLog.sexualActivity}
              onToggle={(item) => toggleItem("sexualActivity", item)}
            />

            <EntrySection
              title="Symptoms"
              subtitle="Expected signs can be highlighted first, and your saved symptoms drive the inference card above."
              groupedItems={symptomGroups}
              expectedItemsByCategory={expectedSymptomsByCategory}
              showAllToggle
              showAllSymptoms={showAllSymptoms}
              onToggleShowAll={() => setShowAllSymptoms((prev) => !prev)}
              selectedItems={selectedLog.symptoms}
              onToggle={(item) => toggleItem("symptoms", item)}
            />

            <EntrySection
              title="Contraception"
              subtitle="Record the method used for this date."
              items={contraceptionOptions}
              selectedItems={selectedLog.contraception}
              onToggle={(item) => toggleItem("contraception", item)}
            />

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
              <div>
                <h3 className="text-xl font-semibold">Notes</h3>
                <p className="mt-1 text-sm text-white/55">Add anything relevant for symptoms, bleeding, activity, or testing.</p>
              </div>
              <textarea
                value={selectedLog.notes}
                onChange={(e) => updateNotes(e.target.value)}
                className="mt-4 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white placeholder:text-white/35 focus:border-[#d3ae91] focus:outline-none"
                placeholder="Write notes for this date..."
              />
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
          <div>
            <h2 className="text-2xl font-bold">Inference weights</h2>
            <p className="mt-1 text-sm text-white/55">Reference signals the app uses when estimating likely cycle timing from symptoms.</p>
          </div>
          <div className="mt-4 grid gap-3">
            {Object.entries(phasePredictionWeights).map(([key, values]) => (
              <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">{key}</p>
                <p className="mt-2 text-sm text-white/75">{values.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-white/35">
          Saved locally in your browser. For accounts and sync across devices, connect a real backend later.
        </p>
      </div>
    </main>
  );
}

function InsightCard({ label, value }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/55">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function EntrySection({
  title,
  subtitle,
  items,
  groupedItems,
  expectedItemsByCategory,
  showAllToggle,
  showAllSymptoms,
  onToggleShowAll,
  selectedItems = [],
  onToggle,
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-white/55">{subtitle}</p>
        </div>
        {showAllToggle ? (
          <div className="flex gap-2">
            <button className="rounded-full bg-[#d3ae91] px-4 py-2 text-sm font-semibold text-[#2b1e1b]">
              Expected first
            </button>
            <button onClick={onToggleShowAll} className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/85">
              {showAllSymptoms ? "Show expected" : "Show all"}
            </button>
          </div>
        ) : null}
      </div>

      {items ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => {
            const selected = selectedItems.includes(item);
            return (
              <button
                key={item}
                onClick={() => onToggle(item)}
                className={`rounded-full px-4 py-2 text-sm transition ${selected ? "border border-[#d3ae91]/30 bg-[#d3ae91]/15 text-white" : "border border-white/10 bg-black/20 text-white/85 hover:border-[#d3ae91] hover:bg-white/10"}`}
              >
                {item}
              </button>
            );
          })}
        </div>
      ) : null}

      {groupedItems ? (
        <div className="mt-4 space-y-4">
          {groupedItems.map((group) => {
            const expected = expectedItemsByCategory?.[group.title] ?? [];
            const remaining = group.items.filter((item) => !expected.includes(item));
            const visibleItems = showAllSymptoms ? group.items : [...expected, ...remaining.slice(0, 8)];

            return (
              <div key={group.title}>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-white/45">{group.title}</p>
                <div className="flex flex-wrap gap-2">
                  {visibleItems.map((item) => {
                    const selected = selectedItems.includes(item);
                    const expectedItem = expected.includes(item);
                    return (
                      <button
                        key={`${group.title}-${item}`}
                        onClick={() => onToggle(item)}
                        className={`rounded-full px-3 py-2 text-sm transition ${selected ? "border border-[#d3ae91]/30 bg-[#d3ae91]/18 text-white" : expectedItem ? "border border-[#d3ae91]/30 bg-[#d3ae91]/10 text-white" : "border border-white/10 bg-black/20 text-white/85 hover:border-[#d3ae91] hover:bg-white/10"}`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PremiumRecommendationCard({ eyebrow, title, href, cta }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-4 transition hover:bg-white/[0.08]"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{eyebrow}</p>
      <p className="mt-2 text-base font-semibold text-white">{title}</p>
      <p className="mt-3 text-sm text-[#d3ae91]">{cta} →</p>
    </a>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-white/75">{label}</span>
    </div>
  );
}
