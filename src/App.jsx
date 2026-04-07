import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "her-rhythm-dynamic-v6";
const ONBOARDING_KEY = "her-rhythm-onboarding-v6";
const DAY_MS = 1000 * 60 * 60 * 24;

const TABS = [
  "Cycle Insight",
  "Activities & Symptoms",
  "Stats",
  "Wellness",
  "Fitness",
  "Health",
  "Nutrition",
];

const phaseMeta = {
  Menstrual: {
    emoji: "🩸",
    title: "Menstrual phase",
    subtitle: "Focus on rest, recovery, hydration, and reducing inflammation.",
    focus: "Recovery, hydration, iron support, and lower intensity movement.",
    accent: "from-rose-400/30 to-rose-200/10",
    badge: "bg-rose-200/20 text-rose-100 border border-rose-200/20",
    fitness: {
      goal: "Recovery and consistency",
      exercise: "Walking, mobility, light yoga",
      duration: "20–30 mins",
      calories: "120–220 kcal",
      watch: "https://yourapp.com/menstrual-workout-video",
      program: "https://yourapp.com/menstrual-program",
      coach: "https://yourapp.com/coach-menstrual",
      shop: "https://yourapp.com/shop-equipment-menstrual",
      featured: "Free featured recovery workout",
      premium: "Premium guided recovery program",
    },
    health: {
      why: "Support recovery, reduce inflammation, and restore energy.",
      text: "Magnesium, iron support, omega-3, electrolytes",
      shop: "https://yourapp.com/supplements-menstrual",
      featured: "Free supplement overview",
      premium: "Premium protocol + shop now",
    },
    nutrition: {
      text: "Warm meals, soups, oats, lentils, spinach, berries",
      watch: "https://yourapp.com/watch-cooking-menstrual",
      menu: "https://yourapp.com/menu-menstrual",
      shop: "https://yourapp.com/shop-ingredients-menstrual",
      featured: "Free featured meal ideas",
      premium: "Premium recipe + craving support plan",
    },
    fasting: "Keep fasting flexible and shorter if energy feels lower.",
  },
  Follicular: {
    emoji: "🌱",
    title: "Follicular phase",
    subtitle: "Focus on building energy, consistency, and structured progress.",
    focus:
      "Use rising energy for training consistency, lighter appetite control, and habit building.",
    accent: "from-green-400/30 to-emerald-200/10",
    badge: "bg-green-200/20 text-green-100 border border-green-200/20",
    fitness: {
      goal: "Build strength and momentum",
      exercise: "Strength training, Pilates, progressive sessions",
      duration: "35–45 mins",
      calories: "220–340 kcal",
      watch: "https://yourapp.com/follicular-workout-video",
      program: "https://yourapp.com/follicular-program",
      coach: "https://yourapp.com/coach-follicular",
      shop: "https://yourapp.com/shop-equipment-follicular",
      featured: "Free featured strength session",
      premium: "Premium phase-based training plan",
    },
    health: {
      why: "Rising estrogen may support energy, mood, and exercise tolerance.",
      text: "B-vitamins, probiotics, creatine",
      shop: "https://yourapp.com/supplements-follicular",
      featured: "Free hormone support overview",
      premium: "Premium supplement guide + referrals",
    },
    nutrition: {
      text: "Fresh meals, lean protein, fiber, colorful produce",
      watch: "https://yourapp.com/watch-cooking-follicular",
      menu: "https://yourapp.com/menu-follicular",
      shop: "https://yourapp.com/shop-ingredients-follicular",
      featured: "Free featured meal ideas",
      premium: "Premium menu + recipe plan",
    },
    fasting: "Moderate fasting may feel easier as energy rises.",
  },
  Ovulation: {
    emoji: "🌸",
    title: "Ovulation phase",
    subtitle: "Focus on performance, hydration, and strategic recovery.",
    focus: "Higher performance, hydration, and inflammation control.",
    accent: "from-amber-300/30 to-yellow-100/10",
    badge: "bg-amber-200/20 text-amber-100 border border-amber-200/20",
    fitness: {
      goal: "Performance and output",
      exercise: "Intervals, performance workouts, full-body strength",
      duration: "40–50 mins",
      calories: "280–420 kcal",
      watch: "https://yourapp.com/ovulation-workout-video",
      program: "https://yourapp.com/ovulation-program",
      coach: "https://yourapp.com/coach-ovulation",
      shop: "https://yourapp.com/shop-equipment-ovulation",
      featured: "Free featured performance workout",
      premium: "Premium performance challenge",
    },
    health: {
      why: "Peak energy can support stronger performance but still needs hydration and recovery support.",
      text: "Electrolytes, antioxidants, magnesium",
      shop: "https://yourapp.com/supplements-ovulation",
      featured: "Free hydration and support overview",
      premium: "Premium supplement plan + referrals",
    },
    nutrition: {
      text: "Balanced plates, hydration, antioxidant foods",
      watch: "https://yourapp.com/watch-cooking-ovulation",
      menu: "https://yourapp.com/menu-ovulation",
      shop: "https://yourapp.com/shop-ingredients-ovulation",
      featured: "Free featured meal ideas",
      premium: "Premium performance menu + recipe plan",
    },
    fasting: "Only continue fasting if it still feels supportive for energy and recovery.",
  },
  Luteal: {
    emoji: "🌙",
    title: "Luteal phase",
    subtitle: "Focus on cortisol control, appetite support, and hormone balance.",
    focus:
      "Support appetite with protein, fiber, regular meals, and lower stress load.",
    accent: "from-violet-400/30 to-purple-200/10",
    badge: "bg-violet-200/20 text-violet-100 border border-violet-200/20",
    fitness: {
      goal: "Energy balance and recovery",
      exercise: "Moderate training, walking, mobility, lower-intensity strength",
      duration: "25–40 mins",
      calories: "180–300 kcal",
      watch: "https://yourapp.com/luteal-workout-video",
      program: "https://yourapp.com/luteal-program",
      coach: "https://yourapp.com/coach-luteal",
      shop: "https://yourapp.com/shop-equipment-luteal",
      featured: "Free featured low-stress workout",
      premium: "Premium fatigue-smart training plan",
    },
    health: {
      why: "Progesterone shifts can affect appetite, mood, recovery, and energy.",
      text: "Myo-inositol, magnesium, berberine",
      shop: "https://yourapp.com/supplements-luteal",
      featured: "Free hormone support overview",
      premium: "Premium supplement guide + referrals",
    },
    nutrition: {
      text: "Higher carbs, high protein, craving support meals",
      watch: "https://yourapp.com/watch-cooking-luteal",
      menu: "https://yourapp.com/menu-luteal",
      shop: "https://yourapp.com/shop-ingredients-luteal",
      featured: "Free featured craving-control meals",
      premium: "Premium menu + recipe plan",
    },
    fasting: "Many people prefer more flexibility with fasting in the late luteal phase.",
  },
};

const phaseClasses = {
  Menstrual: "bg-rose-300/25 text-white",
  Follicular: "bg-green-300/25 text-white",
  Ovulation: "bg-amber-300/25 text-white",
  Luteal: "bg-violet-300/25 text-white",
};

const sexualActivityOptions = [
  "Unprotected sex",
  "Protected sex",
  "Masturbation",
  "Kissing",
];
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
const activityOptions = [
  "Walking",
  "Workout",
  "Yoga",
  "Pilates",
  "Running",
  "Swimming",
  "Rest day",
];

const expectedSymptomsByCategory = {
  Menstrual: {
    Premenstrual: ["Cramps", "Bloating", "Breast tenderness", "Fatigue", "Spotting"],
    Body: ["Pelvic pain", "Uterine cramps", "Back pain", "Body heaviness"],
    General: ["Low energy", "Poor sleep", "Fatigue"],
  },
  Follicular: {
    "Post-menstrual": ["Dry days", "Very little discharge", "Mild energy rebound", "Stable mood"],
    General: ["High energy", "Good productivity"],
    Mood: ["Calm", "Motivated"],
  },
  Ovulation: {
    Ovulation: [
      "Watery cervical mucus",
      "Clear stretchy mucus",
      "Egg-white mucus",
      "Increased libido",
      "More energy",
    ],
    Discharge: ["Wet", "Watery", "Clear", "Stretchy"],
    Cervix: ["High", "Soft", "Open"],
  },
  Luteal: {
    Premenstrual: ["Food cravings", "Increased appetite", "Bloating", "Mood swings", "Fatigue"],
    Digestion: ["Food cravings", "Appetite increase", "Bloating"],
    Mood: ["Anxious", "Moody", "Irritable"],
    General: ["Low energy", "Restless sleep", "Poor sleep"],
  },
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
      "Pregnancy glow",
    ],
  },
  { title: "Emotion", items: ["Emotional sensitivity", "Feeling overwhelmed", "Stress", "Calmness", "Feeling affectionate", "Need for reassurance", "Easily upset"] },
  { title: "Head", items: ["Headache", "Migraine", "Dizziness", "Brain fog", "Poor focus", "Sensitivity to light", "Sensitivity to sound"] },
  { title: "Body", items: ["Pelvic pain", "Uterine cramps", "Back pain", "Breast tenderness", "Breast swelling", "Muscle aches", "Joint pain", "Body heaviness", "Hot flashes", "Chills", "Tender abdomen", "Hip pain"] },
  { title: "Digestion", items: ["Nausea", "Vomiting", "Bloating", "Gas", "Constipation", "Diarrhea", "Heartburn", "Appetite increase", "Appetite decrease", "Food cravings", "Food aversions", "Stomach pain"] },
  { title: "General", items: ["Fatigue", "Low energy", "High energy", "Poor sleep", "Restless sleep", "Insomnia", "Feeling run down", "Weight fluctuation", "Low motivation", "Good productivity"] },
  { title: "Libido", items: ["Higher libido", "Lower libido", "Comfortable sex", "Painful sex", "Easier orgasm", "Harder orgasm"] },
  { title: "Cervix", items: ["High", "Medium", "Low", "Soft", "Firm", "Open", "Closed", "Hard to reach", "Easy to reach"] },
  { title: "Discharge", items: ["Dry", "Sticky", "Creamy", "Wet", "Watery", "Slippery", "Clear", "Cloudy", "Stretchy", "Egg-white", "Thick", "Milky", "Yellowish", "Spotting", "Blood-tinged"] },
  { title: "Mood", items: ["Happy", "Neutral", "Calm", "Irritable", "Angry", "Sad", "Low mood", "Anxious", "Moody", "Motivated", "Restless", "Social", "Withdrawn", "Confident", "Insecure"] },
];

const phasePredictionWeights = {
  Menstrual: ["Cramps", "Pelvic heaviness", "Lower back pain", "Uterine cramps", "Back pain", "Spotting", "Tender abdomen", "Fatigue", "Low energy", "Body heaviness", "Poor sleep"],
  Follicular: ["Dry days", "Very little discharge", "Sticky discharge", "Mild energy rebound", "Stable mood", "Clearer skin", "Good productivity", "High energy", "Motivated", "Calm"],
  Ovulation: ["One-sided pelvic pain", "Mild cramping", "Wet sensation", "Slippery sensation", "Watery cervical mucus", "Clear stretchy mucus", "Egg-white mucus", "Wet", "Watery", "Slippery", "Clear", "Stretchy", "Egg-white", "Higher libido", "Increased libido", "More energy", "High energy", "High", "Soft", "Open", "Cervix feels higher", "Cervix feels softer", "Cervix feels more open"],
  Luteal: ["Bloating", "Food cravings", "Increased appetite", "Appetite increase", "Breast swelling", "Breast tenderness", "Mood swings", "Irritability", "Poor sleep", "Restless sleep", "Fatigue", "Low motivation", "Body heaviness", "Anxious", "Moody"],
  Pregnancy: ["Missed period", "Nausea", "Vomiting", "Frequent urination", "Milky discharge", "Breast fullness", "Food aversions", "Increased smell sensitivity", "Taste changes", "Pregnancy glow", "Appetite changes"],
};

const fastingPlans = {
  basic: [
    { title: "12:12", fasting: "12h fasting", eating: "12h eating" },
    { title: "13:11", fasting: "13h fasting", eating: "11h eating" },
    { title: "14:10", fasting: "14h fasting", eating: "10h eating" },
    { title: "15:9", fasting: "15h fasting", eating: "9h eating" },
  ],
  intermediate: [
    { title: "16:8", fasting: "16h fasting", eating: "8h eating" },
    { title: "17:7", fasting: "17h fasting", eating: "7h eating" },
    { title: "18:6", fasting: "18h fasting", eating: "6h eating" },
    { title: "19:5", fasting: "19h fasting", eating: "5h eating" },
  ],
  advanced: [
    { title: "20:4", fasting: "20h fasting", eating: "4h eating" },
    { title: "21:3", fasting: "21h fasting", eating: "3h eating" },
    { title: "22:2", fasting: "22h fasting", eating: "2h eating" },
    { title: "23:1", fasting: "23h fasting", eating: "1h eating" },
    { title: "24:0", fasting: "24h fasting", eating: "Refeed after fast" },
    { title: "48:0", fasting: "48h fasting", eating: "Stay hydrated" },
    { title: "72:0", fasting: "72h fasting", eating: "Stay hydrated" },
  ],
};

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a, b) {
  return Math.round((startOfDay(a) - startOfDay(b)) / DAY_MS);
}

function formatShort(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatLong(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function monthLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
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

function parsePlanHours(planTitle) {
  const [fastingHours, eatingHours] = String(planTitle || "14:10")
    .split(":")
    .map((v) => Number(v));
  return {
    fastingHours: Number.isFinite(fastingHours) ? fastingHours : 14,
    eatingHours: Number.isFinite(eatingHours) ? eatingHours : 10,
  };
}

function applyPlanToStart(startIso, planTitle) {
  const start = new Date(startIso);
  const { fastingHours } = parsePlanHours(planTitle);
  const end = new Date(start.getTime() + fastingHours * 60 * 60 * 1000);
  return end.toISOString().slice(0, 16);
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
      fertile: cycleDay >= ovulationDay - 4 && cycleDay <= ovulationDay + 1,
      ovulation: cycleDay === ovulationDay,
      periodStart: Boolean(log?.periodStart),
      periodEnd: Boolean(log?.periodEnd),
    };
  });
}

function buildExpectedSymptomsForPhase(phaseName) {
  return expectedSymptomsByCategory[phaseName] || {};
}

function inferPhaseFromSymptoms(symptoms, cyclePhaseHint) {
  const scores = {
    Menstrual: 0,
    Follicular: 0,
    Ovulation: 0,
    Luteal: 0,
    Pregnancy: 0,
  };

  symptoms.forEach((symptom) => {
    Object.entries(phasePredictionWeights).forEach(([phase, weights]) => {
      if (weights.includes(symptom)) scores[phase] += 1;
    });
  });

  if (cyclePhaseHint && scores[cyclePhaseHint] !== undefined) {
    scores[cyclePhaseHint] += 1;
  }

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [phase, score] = entries[0];
  const second = entries[1]?.[1] ?? 0;
  const baseConfidence = score === 0 ? 0 : Math.round((score / Math.max(1, symptoms.length || 1)) * 100);
  const confidence = score === 0 ? 0 : Math.min(97, baseConfidence + Math.min(20, (score - second) * 6));

  return {
    phase,
    label: score === 0 ? `Likely ${String(cyclePhaseHint || "luteal").toLowerCase()} phase` : `Likely ${phase.toLowerCase()} phase`,
    confidence,
    confidenceLabel:
      confidence >= 82
        ? "Strong match"
        : confidence >= 58
          ? "Moderate match"
          : confidence > 0
            ? "Early signal"
            : "No clear pattern",
    fertilityLabel:
      phase === "Ovulation"
        ? "Likely fertile window"
        : phase === "Luteal"
          ? "Likely post-ovulation"
          : phase === "Follicular"
            ? "Likely pre-ovulation"
            : "Likely menstrual timing",
    scores,
  };
}

function emptyLog(nowIso) {
  const start = nowIso || new Date().toISOString().slice(0, 16);
  return {
    symptoms: [],
    activities: [],
    sexualActivity: [],
    contraception: [],
    notes: "",
    height: 165,
    weight: 65,
    hydrationGoal: 2000,
    hydrationMl: 0,
    steps: 0,
    sleep: 0,
    bmiStartWeight: 65,
    activeMinutes: 0,
    activityCalories: 0,
    fastingPlan: "14:10",
    fastingStartDateTime: start,
    fastingEndDateTime: applyPlanToStart(start, "14:10"),
    periodStart: false,
    periodEnd: false,
  };
}

export default function CycleWellnessPage() {
  const [now, setNow] = useState(new Date());
  const today = startOfDay(now);
  const yesterday = addDays(today, -1);

  const [lastPeriodStart, setLastPeriodStart] = useState(dateKey(yesterday));
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [viewDate, setViewDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [hasUserSelectedDate, setHasUserSelectedDate] = useState(false);
  const [logs, setLogs] = useState({});
  const [tab, setTab] = useState("Cycle Insight");
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [goals, setGoals] = useState([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.lastPeriodStart) setLastPeriodStart(parsed.lastPeriodStart);
        if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
        if (parsed.periodLength) setPeriodLength(parsed.periodLength);
        if (parsed.viewDate) setViewDate(startOfDay(parsed.viewDate));
        if (parsed.selectedDate) setSelectedDate(startOfDay(parsed.selectedDate));
        if (parsed.logs) setLogs(parsed.logs);
        if (typeof parsed.hasUserSelectedDate === "boolean") setHasUserSelectedDate(parsed.hasUserSelectedDate);
        if (parsed.tab) setTab(parsed.tab);
      } catch (error) {
        console.error(error);
      }
    }

    const onboardingRaw = localStorage.getItem(ONBOARDING_KEY);
    if (onboardingRaw) {
      try {
        const parsed = JSON.parse(onboardingRaw);
        if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
        if (parsed.periodLength) setPeriodLength(parsed.periodLength);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.completed) setOnboardingComplete(true);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lastPeriodStart,
        cycleLength,
        periodLength,
        viewDate: dateKey(viewDate),
        selectedDate: dateKey(selectedDate),
        hasUserSelectedDate,
        logs,
        tab,
      })
    );
  }, [lastPeriodStart, cycleLength, periodLength, viewDate, selectedDate, hasUserSelectedDate, logs, tab]);

  useEffect(() => {
    localStorage.setItem(
      ONBOARDING_KEY,
      JSON.stringify({
        cycleLength,
        periodLength,
        goals,
        completed: onboardingComplete,
      })
    );
  }, [cycleLength, periodLength, goals, onboardingComplete]);

  const lastPeriodDateObj = startOfDay(lastPeriodStart);
  const currentCycleDay = getCycleDay(today, lastPeriodDateObj, cycleLength);
  const ovulationDay = getOvulationDay(cycleLength);
  const currentPhaseName = getPhase(currentCycleDay, periodLength, ovulationDay);
  const currentPhase = phaseMeta[currentPhaseName];

  const selectedCycleDay = getCycleDay(selectedDate, lastPeriodDateObj, cycleLength);
  const selectedLog = logs[dateKey(selectedDate)] || emptyLog(now.toISOString().slice(0, 16));
  const selectedPhaseName = selectedLog.periodStart
    ? "Menstrual"
    : selectedLog.periodEnd
      ? "Follicular"
      : getPhase(selectedCycleDay, periodLength, ovulationDay);
  const selectedChance = getPregnancyChance(selectedCycleDay, ovulationDay);
  const inference = inferPhaseFromSymptoms(selectedLog.symptoms, selectedPhaseName);

  const calendarDays = useMemo(
    () => buildCalendarDays(viewDate, lastPeriodDateObj, cycleLength, periodLength, logs),
    [viewDate, lastPeriodDateObj, cycleLength, periodLength, logs]
  );

  const learnedHistoryCount = useMemo(
    () => Object.values(logs).filter((entry) => entry?.periodStart).length,
    [logs]
  );
  const remainingCycles = Math.max(0, 3 - learnedHistoryCount);

  const nextPeriodStart = useMemo(() => {
    let next = new Date(lastPeriodDateObj);
    while (startOfDay(next) <= today) next = addDays(next, cycleLength);
    return next;
  }, [lastPeriodDateObj, cycleLength, today]);

  const ovulationDate = addDays(nextPeriodStart, -(cycleLength - ovulationDay));
  const fertileStart = addDays(ovulationDate, -4);
  const fertileEnd = addDays(ovulationDate, 1);

  const estimatedCaloriesFromSteps = Math.round(Number(selectedLog.steps || 0) * 0.04);

  const bmi = useMemo(() => {
    const meters = Number(selectedLog.height || 165) / 100;
    return meters > 0
      ? (Number(selectedLog.weight || 65) / (meters * meters)).toFixed(1)
      : "0.0";
  }, [selectedLog.height, selectedLog.weight]);

  const statsData = {
    dayOfCycle: selectedCycleDay,
    fertility: inference.confidence > 0 ? inference.fertilityLabel : "Likely post-ovulation",
    ovulation:
      selectedCycleDay > ovulationDay
        ? "Past predicted ovulation"
        : selectedCycleDay === ovulationDay
          ? "Predicted ovulation"
          : "Ovulation approaching",
    pregnancyChance: `${selectedChance.label} chance of pregnancy`,
    inferredPhase: inference.label,
    confidence: `${inference.confidence}% confidence`,
    scores: inference.scores,
  };

  const fastingCountdown = useMemo(() => {
    const start = new Date(selectedLog.fastingStartDateTime);
    const end = new Date(selectedLog.fastingEndDateTime);
    const remaining = Math.max(0, end - now);
    const elapsed = Math.max(0, now - start);
    const hrs = String(Math.floor(remaining / 3600000)).padStart(2, "0");
    const mins = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
    const secs = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

    return {
      display: `${hrs}:${mins}:${secs}`,
      elapsedHours: Math.floor(elapsed / 3600000),
      remainingMs: remaining,
    };
  }, [selectedLog.fastingStartDateTime, selectedLog.fastingEndDateTime, now]);

  useEffect(() => {
    const currentCalories = Number(selectedLog.activityCalories || 0);
    if (currentCalories !== estimatedCaloriesFromSteps) {
      updateSingleField("activityCalories", estimatedCaloriesFromSteps, false);
    }
  }, [selectedLog.steps]);

  function updateLogForDate(key, updater) {
    setLogs((prev) => {
      const current = prev[key] || emptyLog(now.toISOString().slice(0, 16));
      return { ...prev, [key]: updater(current) };
    });
  }

  function toggleItem(section, item) {
    const key = dateKey(selectedDate);
    updateLogForDate(key, (current) => {
      const exists = current[section].includes(item);
      return {
        ...current,
        [section]: exists
          ? current[section].filter((value) => value !== item)
          : [...current[section], item],
      };
    });
  }

  function updateSingleField(field, value, shouldAdjustFasting = true) {
    const key = dateKey(selectedDate);
    updateLogForDate(key, (current) => {
      const next = { ...current, [field]: value };

      if (shouldAdjustFasting && field === "fastingPlan") {
        next.fastingEndDateTime = applyPlanToStart(next.fastingStartDateTime, value);
      }
      if (shouldAdjustFasting && field === "fastingStartDateTime") {
        next.fastingEndDateTime = applyPlanToStart(value, next.fastingPlan);
      }

      return next;
    });
  }

  function markPeriodStart(date) {
    const key = dateKey(date);
    setLastPeriodStart(key);
    updateLogForDate(key, (current) => ({
      ...current,
      periodStart: true,
      periodEnd: false,
    }));
  }

  function markPeriodEnd(date) {
    const key = dateKey(date);
    updateLogForDate(key, (current) => ({
      ...current,
      periodEnd: true,
      periodStart: false,
    }));
    setSelectedDate(startOfDay(date));
  }

  function toggleGoal(goal) {
    setGoals((prev) => {
      if (prev.includes(goal)) return prev.filter((item) => item !== goal);
      if (prev.length >= 3) return prev;
      return [...prev, goal];
    });
  }

  function finishOnboarding() {
    setOnboardingComplete(true);
  }

  function openSelectedDate(date) {
    setSelectedDate(date);
    setHasUserSelectedDate(true);
  }

  if (!onboardingComplete) {
    return (
      <main className="min-h-screen bg-[#131217] text-white">
        <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-6">
          <div className="w-full rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#34243a] via-[#241d30] to-[#1a1824] p-6 shadow-2xl">
            {onboardingStep === 1 && (
              <div>
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
                  Her Rhythm: Cycle, Fuel, Flow
                </div>
                <h1 className="mt-5 text-4xl font-bold leading-tight">
                  Understand Your Body, Beyond the Cycle
                </h1>
                <p className="mt-4 text-base leading-7 text-white/70">
                  Get personalized insights, guidance, and patterns based on your unique rhythm.
                </p>
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="mt-8 w-full rounded-2xl bg-[#d3ae91] px-5 py-4 text-base font-semibold text-[#2b1e1b] shadow-lg shadow-[#d3ae91]/20"
                >
                  Get started
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-white/45">Step 2 of 3</div>
                <h2 className="mt-4 text-3xl font-bold">Tell us about your cycle</h2>
                <p className="mt-3 text-white/70">
                  You can adjust this anytime — your insights will improve as you log more data.
                </p>
                <div className="mt-6 grid gap-4">
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
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(1)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base font-medium text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardingStep(3)}
                    className="w-full rounded-2xl bg-[#d3ae91] px-5 py-4 text-base font-semibold text-[#2b1e1b]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-white/45">Step 3 of 3</div>
                <h2 className="mt-4 text-3xl font-bold">What would you like to improve?</h2>
                <p className="mt-3 text-white/70">
                  Choose up to 3 focus areas so we can personalize your guidance.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    "Balance hormones",
                    "Improve energy",
                    "Reduce symptoms",
                    "Fat loss & fitness",
                    "Understand fertility",
                  ].map((goal) => {
                    const selected = goals.includes(goal);
                    return (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`rounded-full px-4 py-3 text-sm transition ${
                          selected
                            ? "border border-[#d3ae91]/30 bg-[#d3ae91]/15 text-white"
                            : "border border-white/10 bg-black/20 text-white/85 hover:border-[#d3ae91] hover:bg-white/10"
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(2)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base font-medium text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={finishOnboarding}
                    className="w-full rounded-2xl bg-[#d3ae91] px-5 py-4 text-base font-semibold text-[#2b1e1b]"
                  >
                    See insight
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#131217] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#34243a] via-[#241d30] to-[#1a1824] p-5 shadow-2xl">
          <div className={`inline-flex rounded-full px-4 py-2 text-sm font-medium backdrop-blur ${currentPhase.badge}`}>
            {currentPhase.title}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Cycle day</p>
                  <p className="mt-2 text-4xl font-bold">Day {currentCycleDay}</p>
                </div>
                <div className={`rounded-3xl bg-gradient-to-br p-4 ring-1 ring-white/10 ${currentPhase.accent}`}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Auto-detected cycle phase</p>
                  <p className="mt-2 text-2xl font-bold">
                    {currentPhase.emoji} {currentPhaseName}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Recommended focus</p>
                <p className="mt-2 text-base text-white/80">{currentPhase.focus}</p>
                <p className="mt-3 text-sm text-white/45">
                  Personalized after {remainingCycles} more logged cycle{remainingCycles === 1 ? "" : "s"}.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-4">
              <h2 className="text-xl font-bold">Cycle calendar</h2>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                >
                  ←
                </button>
                <div className="rounded-2xl bg-white/5 px-4 py-2 text-base font-semibold">
                  {monthLabel(viewDate)}
                </div>
                <button
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                >
                  →
                </button>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-7 gap-2">
                {calendarDays.map((item, index) => {
                  const base = item.muted
                    ? "bg-white/[0.03] text-white/35"
                    : phaseClasses[item.phase] || "bg-white/[0.03] text-white";
                  const fertile = item.fertile ? "shadow-[0_0_0_1px_rgba(255,209,102,0.45)]" : "";
                  const ovulation = item.ovulation
                    ? "after:absolute after:bottom-1 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-white"
                    : "";
                  const selected =
                    hasUserSelectedDate && dateKey(item.date) === dateKey(selectedDate)
                      ? "ring-2 ring-[#d3ae91] shadow-lg shadow-[#d3ae91]/20"
                      : "ring-1 ring-white/5";
                  const manualEdge = item.periodStart
                    ? "border border-rose-200/80"
                    : item.periodEnd
                      ? "border border-green-200/80"
                      : "";

                  return (
                    <button
                      key={`${item.day}-${index}`}
                      onClick={() => openSelectedDate(item.date)}
                      className={`relative h-10 rounded-xl text-sm font-semibold transition hover:scale-[1.02] ${base} ${fertile} ${ovulation} ${selected} ${manualEdge}`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {hasUserSelectedDate && (
          <section className="mt-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white/55">Selected date</p>
                <h3 className="mt-1 text-2xl font-bold">{formatLong(selectedDate)}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => markPeriodStart(selectedDate)}
                  className="rounded-full bg-[#d3ae91] px-4 py-2 text-sm font-semibold text-[#2b1e1b]"
                >
                  Edit as period start
                </button>
                <button
                  onClick={() => markPeriodEnd(selectedDate)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85"
                >
                  Edit as period end
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/55">
              Edit as period start sets Day 1 and menstrual phase. Edit as period end marks the end of menstrual phase and future days move into follicular phase.
            </p>
          </section>
        )}

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {TABS.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                tab === item
                  ? "border-[#d3ae91]/40 bg-[#d3ae91]/12 text-white"
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "Cycle Insight" && (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Cycle setup</h2>
                  <p className="mt-1 text-sm text-white/55">Update your cycle settings and open cycle predictions.</p>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  Cycle Insight
                </button>
              </div>
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
                  <NumberField label="Cycle length" value={cycleLength} onChange={setCycleLength} min={21} max={40} />
                  <NumberField label="Period length" value={periodLength} onChange={setPeriodLength} min={2} max={10} />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Cycle predictions</h2>
                  <p className="mt-1 text-sm text-white/55">Dynamic estimates based on your current cycle length and saved logs.</p>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  Cycle Insight
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <InsightCard label="Predicted ovulation" value={formatShort(ovulationDate)} />
                <InsightCard label="Fertile window" value={`${formatShort(fertileStart)} – ${formatShort(fertileEnd)}`} />
                <InsightCard label="Next period" value={formatShort(nextPeriodStart)} />
              </div>
            </Card>
          </section>
        )}

        {tab === "Activities & Symptoms" && (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Activities and symptoms</h2>
                  <p className="mt-1 text-sm text-white/55">
                    Expected signs are surfaced first, and your saved symptoms feed a rule-based hormonal phase inference engine.
                  </p>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  Activities & Symptoms
                </button>
              </div>
              <div className="mt-4 grid gap-5">
                <EntrySection
                  title="Activities"
                  subtitle="Tick activity logged for the selected date."
                  items={activityOptions}
                  selectedItems={selectedLog.activities}
                  onToggle={(item) => toggleItem("activities", item)}
                />
                <EntrySection
                  title="Sexual activity"
                  subtitle="Tick activity logged for this date."
                  items={sexualActivityOptions}
                  selectedItems={selectedLog.sexualActivity}
                  onToggle={(item) => toggleItem("sexualActivity", item)}
                />
                <EntrySection
                  title="Contraception"
                  subtitle="Tick the method used for this date."
                  items={contraceptionOptions}
                  selectedItems={selectedLog.contraception}
                  onToggle={(item) => toggleItem("contraception", item)}
                />
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-xl font-semibold">Daily check-ins</h3>
                  <p className="mt-1 text-sm text-white/55">Free writing for anything relevant you want to remember.</p>
                  <textarea
                    value={selectedLog.notes}
                    onChange={(e) => updateSingleField("notes", e.target.value)}
                    className="mt-4 min-h-[130px] w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none"
                    placeholder="How are you feeling today?"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <EntrySection
                title="Symptoms"
                subtitle={`Auto-detected expected signs are surfaced first for the ${selectedPhaseName.toLowerCase()} phase, with an option to show all symptoms.`}
                groupedItems={symptomGroups}
                expectedItemsByCategory={buildExpectedSymptomsForPhase(selectedPhaseName)}
                showAllToggle
                showAllSymptoms={showAllSymptoms}
                onToggleShowAll={() => setShowAllSymptoms((prev) => !prev)}
                selectedItems={selectedLog.symptoms}
                onToggle={(item) => toggleItem("symptoms", item)}
              />
            </Card>
          </section>
        )}

        {tab === "Stats" && (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Stats</h2>
                  <p className="mt-1 text-sm text-white/55">Auto-detected from cycle insight data, symptoms, activities, and saved logs.</p>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  Stats
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoPill label="Day of cycle" value={`Day ${statsData.dayOfCycle}`} />
                <InfoPill label="Fertility" value={statsData.fertility} />
                <InfoPill label="Ovulation" value={statsData.ovulation} />
                <InfoPill label="Pregnancy chance" value={statsData.pregnancyChance} />
                <InfoPill label="Predicted from selected symptoms" value={statsData.inferredPhase} />
                <InfoPill label="Confidence" value={statsData.confidence} />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-5">
                {Object.entries(statsData.scores).map(([key, value]) => (
                  <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                    <div className="text-xs uppercase tracking-[0.14em] text-white/45">{key}</div>
                    <div className="mt-2 text-xl font-semibold">{value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-white/65">
                This estimate uses a safe rule-based symptom scoring model layered on top of your cycle calendar, activities and symptoms, and saved logs.
              </p>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold">Phase score snapshot</h2>
              <div className="mt-4 grid gap-4">
                {Object.entries(statsData.scores).map(([key, value]) => (
                  <div key={key}>
                    <div className="mb-2 flex justify-between text-sm text-white/70">
                      <span>{key}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-300 to-blue-300"
                        style={{ width: `${Math.min(100, value * 25)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {tab === "Wellness" && (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Wellness</h2>
                  <p className="mt-1 text-sm text-white/55">Track height, weight, BMI, hydration, steps, sleep, and daily progress.</p>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  Wellness
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <NumberField label="Height (cm)" value={selectedLog.height} onChange={(v) => updateSingleField("height", v)} min={120} max={220} />
                <NumberField label="Weight (kg)" value={selectedLog.weight} onChange={(v) => updateSingleField("weight", v)} min={30} max={200} />
                <NumberField label="Hydration goal (ml)" value={selectedLog.hydrationGoal} onChange={(v) => updateSingleField("hydrationGoal", v)} min={500} max={5000} />
                <NumberField label="Hydration today (ml)" value={selectedLog.hydrationMl} onChange={(v) => updateSingleField("hydrationMl", v)} min={0} max={6000} />
                <NumberField label="Steps" value={selectedLog.steps} onChange={(v) => updateSingleField("steps", v)} min={0} max={50000} />
                <InfoPill label="Calories burned" value={`${estimatedCaloriesFromSteps} kcal`} />
                <NumberField label="Sleep (hrs)" value={selectedLog.sleep} onChange={(v) => updateSingleField("sleep", v)} min={0} max={24} step="0.1" />
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold">Auto-detected progress</h2>
              <div className="mt-4 grid gap-4">
                <StatProgress label="BMI" value={`${bmi}`} progress={Math.min(100, (Number(bmi) / 35) * 100)} />
                <StatProgress label="Hydration" value={`${selectedLog.hydrationMl} / ${selectedLog.hydrationGoal} ml`} progress={Math.min(100, (Number(selectedLog.hydrationMl) / Math.max(1, Number(selectedLog.hydrationGoal))) * 100)} />
                <StatProgress label="Steps" value={`${selectedLog.steps} / 10000`} progress={Math.min(100, (Number(selectedLog.steps) / 10000) * 100)} />
                <StatProgress label="Sleep" value={`${selectedLog.sleep} / 8 hrs`} progress={Math.min(100, (Number(selectedLog.sleep) / 8) * 100)} />
              </div>
            </Card>
          </section>
        )}

        {tab === "Fitness" && (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Fitness</h2>
                  <p className="mt-1 text-sm text-white/55">Auto-detected workout recommendation according to your current cycle phase.</p>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  Predicted Cycle Phase
                </button>
              </div>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100">
                  Free featured view
                </div>
                <h3 className="mt-3 text-xl font-semibold">{currentPhase.fitness.featured}</h3>
                <p className="mt-2 text-sm text-white/70">Goal: {currentPhase.fitness.goal}</p>
                <p className="mt-1 text-sm text-white/70">Exercise: {currentPhase.fitness.exercise}</p>
                <p className="mt-1 text-sm text-white/70">Duration: {currentPhase.fitness.duration}</p>
                <p className="mt-1 text-sm text-white/70">Estimated burned calories: {currentPhase.fitness.calories}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <LinkButton href={currentPhase.fitness.watch} label="Watch workout / tutorial" />
                  <LinkButton href={currentPhase.fitness.program} label="Join program / challenge" />
                  <LinkButton href={currentPhase.fitness.coach} label="Train with coach" />
                  <LinkButton href={currentPhase.fitness.shop} label="Shop equipment" />
                </div>
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="mt-4 w-full rounded-2xl bg-[#d3ae91] px-4 py-3 text-sm font-semibold text-[#2b1e1b]"
                >
                  Premium fitness plan
                </button>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold">Intermittent fasting</h2>
              <p className="mt-1 text-sm text-white/55">{currentPhase.fasting}</p>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/55">Remaining time</p>
                    <p className="mt-2 text-4xl font-bold">{fastingCountdown.display}</p>
                    <FastingStage hours={fastingCountdown.elapsedHours} />
                  </div>
                  <div className="text-right text-sm text-white/65">
                    <div>Start: {selectedLog.fastingStartDateTime.replace("T", " ")}</div>
                    <div>End: {selectedLog.fastingEndDateTime.replace("T", " ")}</div>
                    <div>Plan: {selectedLog.fastingPlan}</div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <label className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <span className="text-sm text-white/55">Plan</span>
                    <select
                      value={selectedLog.fastingPlan}
                      onChange={(e) => updateSingleField("fastingPlan", e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#131217] px-3 py-2 text-white outline-none"
                    >
                      {[...fastingPlans.basic, ...fastingPlans.intermediate, ...fastingPlans.advanced].map((plan) => (
                        <option key={plan.title} value={plan.title}>
                          {plan.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <span className="text-sm text-white/55">Start date & time</span>
                    <input
                      type="datetime-local"
                      value={selectedLog.fastingStartDateTime}
                      onChange={(e) => updateSingleField("fastingStartDateTime", e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#131217] px-3 py-2 text-white outline-none"
                    />
                  </label>
                  <label className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <span className="text-sm text-white/55">End date & time</span>
                    <input
                      type="datetime-local"
                      value={selectedLog.fastingEndDateTime}
                      onChange={(e) => updateSingleField("fastingEndDateTime", e.target.value, false)}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#131217] px-3 py-2 text-white outline-none"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-4 space-y-5">
                <PlanGrid title="Basic plans" subtitle="Easy to get started for beginners" plans={fastingPlans.basic} selectedPlan={selectedLog.fastingPlan} onSelect={(title) => updateSingleField("fastingPlan", title)} />
                <PlanGrid title="Intermediate plans" subtitle="Most people's choice" plans={fastingPlans.intermediate} selectedPlan={selectedLog.fastingPlan} onSelect={(title) => updateSingleField("fastingPlan", title)} />
                <PlanGrid title="Advanced plans" subtitle="Challenging and professional solutions" plans={fastingPlans.advanced} selectedPlan={selectedLog.fastingPlan} onSelect={(title) => updateSingleField("fastingPlan", title)} />
              </div>
            </Card>
          </section>
        )}

        {tab === "Health" && (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Health</h2>
                  <p className="mt-1 text-sm text-white/55">Supplements recommendation according to the auto-detected cycle phase.</p>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  Predicted Cycle Phase
                </button>
              </div>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100">
                  Free featured view
                </div>
                <h3 className="mt-3 text-xl font-semibold">{currentPhase.health.featured}</h3>
                <p className="mt-2 text-sm text-white/70">Why it matters: {currentPhase.health.why}</p>
                <p className="mt-2 text-sm text-white/70">Recommended support: {currentPhase.health.text}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <LinkButton href={currentPhase.health.shop} label="Shop now" />
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                  >
                    Premium health guide
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold">Health summary</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoPill label="Current phase" value={currentPhaseName} />
                <InfoPill label="Why it matters" value={currentPhase.health.why} />
                <InfoPill label="Featured support" value={currentPhase.health.featured} />
                <InfoPill label="Premium layer" value={currentPhase.health.premium} />
              </div>
            </Card>
          </section>
        )}

        {tab === "Nutrition" && (
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Nutrition / diet / meal plan</h2>
                  <p className="mt-1 text-sm text-white/55">Guided nutrition according to the auto-detected cycle phase.</p>
                </div>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85">
                  Predicted Cycle Phase
                </button>
              </div>
              <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100">
                  Free featured view
                </div>
                <h3 className="mt-3 text-xl font-semibold">{currentPhase.nutrition.featured}</h3>
                <p className="mt-2 text-sm text-white/70">Suggested food direction: {currentPhase.nutrition.text}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <LinkButton href={currentPhase.nutrition.watch} label="Watch cooking" />
                  <LinkButton href={currentPhase.nutrition.menu} label="Get menu / recipe / craving control plan" />
                  <LinkButton href={currentPhase.nutrition.shop} label="Shop ingredients" />
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                  >
                    Premium nutrition plan
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold">Cycle meal planning</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoPill label="Current phase" value={currentPhaseName} />
                <InfoPill label="Recommended focus" value={currentPhase.focus} />
                <InfoPill label="Featured meals" value={currentPhase.nutrition.featured} />
                <InfoPill label="Premium layer" value={currentPhase.nutrition.premium} />
              </div>
            </Card>
          </section>
        )}

        <p className="mt-5 text-center text-xs text-white/35">
          This app is for educational cycle estimates and wellness guidance. Real camera scanning, wearable sync, Samsung Health integration, accounts, and cloud backup would need extra integration later.
        </p>

        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
            <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#1a1824] p-6 shadow-2xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
                Premium preview
              </div>
              <h3 className="mt-4 text-2xl font-bold">Unlock more personalized guidance</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Get deeper fitness, health, supplement, and nutrition guidance tailored to your cycle phase and goals.
              </p>
              <div className="mt-5 grid gap-3">
                {[
                  "Phase-based workouts",
                  "Hormone-support nutrition",
                  "Supplement protocols",
                  "Referral-ready premium links",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-base font-medium text-white"
                >
                  Maybe later
                </button>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full rounded-2xl bg-[#d3ae91] px-5 py-4 text-base font-semibold text-[#2b1e1b]"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Card({ children }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
      {children}
    </section>
  );
}

function NumberField({ label, value, onChange, min, max, step = 1 }) {
  return (
    <label className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <span className="text-sm text-white/55">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
      />
    </label>
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
        {showAllToggle && (
          <div className="flex gap-2">
            <button className="rounded-full bg-[#d3ae91] px-4 py-2 text-sm font-semibold text-[#2b1e1b]">
              Expected first
            </button>
            <button
              onClick={onToggleShowAll}
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/85"
            >
              {showAllSymptoms ? "Show expected" : "Show all"}
            </button>
          </div>
        )}
      </div>

      {items && (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => {
            const selected = selectedItems.includes(item);
            return (
              <button
                key={item}
                onClick={() => onToggle(item)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selected
                    ? "border border-[#d3ae91]/30 bg-[#d3ae91]/15 text-white"
                    : "border border-white/10 bg-black/20 text-white/85 hover:border-[#d3ae91] hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}

      {groupedItems && (
        <div className="mt-4 space-y-4">
          {groupedItems.map((group) => {
            const expected = expectedItemsByCategory?.[group.title] ?? [];
            const visibleItems = showAllSymptoms
              ? group.items
              : [...expected, ...group.items.filter((item) => !expected.includes(item)).slice(0, 8)];

            return (
              <div key={group.title}>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-white/45">
                  {group.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {visibleItems.map((item) => {
                    const selected = selectedItems.includes(item);
                    const expectedItem = expected.includes(item);
                    return (
                      <button
                        key={`${group.title}-${item}`}
                        onClick={() => onToggle(item)}
                        className={`rounded-full px-3 py-2 text-sm transition ${
                          selected
                            ? "border border-[#d3ae91]/30 bg-[#d3ae91]/18 text-white"
                            : expectedItem
                              ? "border border-[#d3ae91]/30 bg-[#d3ae91]/10 text-white"
                              : "border border-white/10 bg-black/20 text-white/85 hover:border-[#d3ae91] hover:bg-white/10"
                        }`}
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
      )}
    </div>
  );
}

function LinkButton({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white/85 hover:bg-white/10"
    >
      {label}
    </a>
  );
}

function StatProgress({ label, value, progress }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm text-white/70">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-3 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-300 to-blue-300"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
}

function PlanGrid({ title, subtitle, plans, selectedPlan, onSelect }) {
  return (
    <div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-1 text-sm text-white/55">{subtitle}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {plans.map((plan) => {
          const selected = selectedPlan === plan.title;
          return (
            <button
              key={plan.title}
              onClick={() => onSelect?.(plan.title)}
              className={`rounded-[1.5rem] border p-4 text-left ${
                selected
                  ? "border-emerald-300/30 bg-emerald-300/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-4xl font-bold">{plan.title}</div>
                {selected ? (
                  <div className="rounded-full bg-emerald-300/20 px-2 py-1 text-[10px] font-semibold text-emerald-100">
                    Selected
                  </div>
                ) : null}
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/80">
                <div>{plan.fasting}</div>
                <div>{plan.eating}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FastingStage({ hours }) {
  const stages = [
    {
      range: "0–4H",
      title: "Blood sugar rises",
      meaning: "Body is still processing recent food and insulin is active.",
      feelings: "You may feel normal, satisfied, or just mildly hungry.",
      coping: "Hydrate, take a light walk, and avoid unnecessary snacking cues.",
    },
    {
      range: "4–8H",
      title: "Blood sugar drops",
      meaning: "Stored glucose starts to be used and hunger waves can appear.",
      feelings: "Hunger waves, slight irritability, or low focus can happen.",
      coping: "Try water, tea, electrolytes, and keep busy through the hunger wave.",
    },
    {
      range: "8–10H",
      title: "Blood sugar is normal",
      meaning: "Energy may stabilize as your body adapts between feeding and fasting.",
      feelings: "You may feel more stable, lighter, or clearer mentally.",
      coping: "Stay hydrated and avoid heavy exertion if you feel light-headed.",
    },
    {
      range: "10–14H",
      title: "Fat burning starts",
      meaning: "The body increasingly shifts toward using fat for fuel.",
      feelings: "You might notice mild fatigue or improved focus depending on adaptation.",
      coping: "Use light movement, hydrate well, and avoid under-eating before fasting.",
    },
    {
      range: "14–18H",
      title: "Entering ketosis",
      meaning: "Ketone production begins to rise for some people.",
      feelings: "Mental clarity may improve, though some feel a temporary dip in energy.",
      coping: "Electrolytes, water, and gentle activity often help.",
    },
    {
      range: "18–24H",
      title: "Autophagy begins",
      meaning: "Cell cleanup activity may start increasing.",
      feelings: "Hunger may calm for some, while others feel more tired.",
      coping: "Prioritize rest, avoid overtraining, and stay hydrated.",
    },
    {
      range: "24–36H",
      title: "Deep ketosis",
      meaning: "The body is relying much more heavily on fat-derived fuel.",
      feelings: "You may feel calm, steady, or more sensitive to stress if under-fueled.",
      coping: "Hydrate well and avoid intense exercise without guidance.",
    },
    {
      range: "36–48H",
      title: "Sensitive to insulin",
      meaning: "Insulin sensitivity may improve and the body is strongly adapted to fasting.",
      feelings: "Stable energy or weakness can both happen depending on the person.",
      coping: "Plan your refeed well and continue electrolytes.",
    },
    {
      range: "48–72H",
      title: "Maximum autophagy",
      meaning: "Extended fasting may deepen cellular cleanup processes.",
      feelings: "Very low hunger is possible, but weakness or dizziness can also happen.",
      coping: "Only continue with supervision, hydrate, and stop if you feel unwell.",
    },
  ];

  const stage =
    hours < 4 ? stages[0] :
    hours < 8 ? stages[1] :
    hours < 10 ? stages[2] :
    hours < 14 ? stages[3] :
    hours < 18 ? stages[4] :
    hours < 24 ? stages[5] :
    hours < 36 ? stages[6] :
    hours < 48 ? stages[7] :
    stages[8];

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-white/55">Current fasting stage</p>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/75">
          {stage.range}
        </span>
      </div>
      <h4 className="mt-2 text-lg font-semibold">{stage.title}</h4>
      <p className="mt-2 text-sm text-white/70">
        <span className="font-medium text-white/85">What it means:</span> {stage.meaning}
      </p>
      <p className="mt-2 text-sm text-white/70">
        <span className="font-medium text-white/85">Possible feelings:</span> {stage.feelings}
      </p>
      <p className="mt-2 text-sm text-white/70">
        <span className="font-medium text-white/85">Coping techniques:</span> {stage.coping}
      </p>
    </div>
  );
}
