import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cycle-wellness-deploy-package-v1';

const phases = {
  menstrual: {
    label: 'Menstrual',
    summary: 'Focus on recovery, hydration, iron-rich meals, and gentler movement.',
    supplements: ['Magnesium support', 'Omega-3 support', 'Electrolytes', 'Vitamin C with iron-rich meals'],
    diet: ['Lentils, spinach, beans', 'Soups and oats', 'Citrus and berries', 'Hydrating foods'],
    exercise: ['Walking', 'Mobility', 'Light yoga', 'Low-intensity strength'],
    optimize: 'Reduce training intensity, protect sleep, and support cramps, fatigue, and hydration.'
  },
  follicular: {
    label: 'Follicular',
    summary: 'Energy usually rises. Great phase for momentum, planning, and progressive training.',
    supplements: ['B-complex support', 'Probiotic or fiber support', 'Creatine for training'],
    diet: ['Lean protein', 'High-fiber meals', 'Fermented foods', 'Colorful vegetables'],
    exercise: ['Strength progression', 'Intervals', 'Pilates', 'Dance or skill work'],
    optimize: 'Use this phase for higher-output training, meal prep, and building consistency.'
  },
  ovulation: {
    label: 'Ovulation',
    summary: 'Performance and confidence may feel high. Fuel well and recover well.',
    supplements: ['Omega-3 support', 'Magnesium support', 'Electrolytes'],
    diet: ['Balanced protein-carb meals', 'Antioxidant-rich foods', 'Hydration focus'],
    exercise: ['Power sessions', 'Sports', 'Harder strength days', 'Running'],
    optimize: 'Great time for high output, but avoid under-fueling or skipping recovery.'
  },
  luteal: {
    label: 'Luteal',
    summary: 'Support blood sugar, cravings, mood, and recovery as PMS may increase later.',
    supplements: ['Magnesium support', 'Omega-3 support', 'Calcium-rich foods', 'B6 within safe limits'],
    diet: ['Protein with each meal', 'Higher-fiber carbs', 'Magnesium-rich foods', 'Satisfying snacks'],
    exercise: ['Moderate strength', 'Zone 2 cardio', 'Walking', 'Deload if needed'],
    optimize: 'Prioritize consistency over intensity and make room for extra rest if symptoms rise.'
  }
};

const foodIdeas = {
  menstrual: ['Iron-rich smoothie', 'Lentil soup', 'Salmon and greens', 'Dark chocolate and berries'],
  follicular: ['Greek yogurt bowl', 'Chicken quinoa salad', 'Veggie omelette', 'High-fiber wrap'],
  ovulation: ['Protein rice bowl', 'Berry chia oats', 'Hydration smoothie', 'Lean sushi bowl'],
  luteal: ['Sweet potato salmon', 'Turkey rice bowl', 'Magnesium trail mix', 'Yogurt and banana']
};

const symptomOptions = ['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Spotting', 'Breast tenderness', 'Acne', 'Mood swings', 'Cravings', 'Back pain', 'High energy', 'Low energy'];

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
  return Math.round((startOfDay(a) - startOfDay(b)) / 86400000);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

function getCycleDay(today, lastPeriodStart, cycleLength) {
  const days = diffDays(today, lastPeriodStart);
  const normalized = ((days % cycleLength) + cycleLength) % cycleLength;
  return normalized + 1;
}

function getPhase(cycleDay, periodLength, ovulationDay) {
  if (cycleDay <= periodLength) return 'menstrual';
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) return 'ovulation';
  if (cycleDay < ovulationDay - 1) return 'follicular';
  return 'luteal';
}

function getPregnancyChance(cycleDay, ovulationDay) {
  const distance = Math.abs(cycleDay - ovulationDay);
  if (distance === 0) return { label: 'High', value: 88, note: 'Around predicted ovulation.' };
  if (distance === 1) return { label: 'High', value: 76, note: 'Within the most fertile window.' };
  if (distance === 2) return { label: 'Moderate', value: 52, note: 'Fertility may still be elevated.' };
  if (distance <= 4) return { label: 'Low–Moderate', value: 28, note: 'Possible but lower than peak days.' };
  return { label: 'Low', value: 8, note: 'Outside the predicted fertile window.' };
}

function buildMonthGrid(viewDate) {
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

function sameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function toInputDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function App() {
  const today = startOfDay(new Date());
  const [tab, setTab] = useState('plan');
  const [lastPeriodStart, setLastPeriodStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return toInputDate(d);
  });
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [viewDate, setViewDate] = useState(today);
  const [symptoms, setSymptoms] = useState(['Fatigue', 'Cramps']);
  const [notes, setNotes] = useState('');
  const [energy, setEnergy] = useState(45);
  const [waterCups, setWaterCups] = useState(6);
  const [history, setHistory] = useState([]);
  const [steps, setSteps] = useState(8200);
  const [activeMinutes, setActiveMinutes] = useState(56);
  const [activityCalories, setActivityCalories] = useState(240);
  const [distanceKm, setDistanceKm] = useState(5.2);
  const [sleepHours, setSleepHours] = useState(7.2);
  const [weightKg, setWeightKg] = useState(65);
  const [waterMl, setWaterMl] = useState(750);
  const [fastingHours, setFastingHours] = useState(14);
  const [fastingGoal, setFastingGoal] = useState(16);
  const [mealQuery, setMealQuery] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && setters[k]) setters[k](v);
      });
    } catch {
      // ignore bad local data
    }
  }, []);

  const setters = {
    lastPeriodStart: setLastPeriodStart,
    cycleLength: setCycleLength,
    periodLength: setPeriodLength,
    symptoms: setSymptoms,
    notes: setNotes,
    energy: setEnergy,
    waterCups: setWaterCups,
    history: setHistory,
    steps: setSteps,
    activeMinutes: setActiveMinutes,
    activityCalories: setActivityCalories,
    distanceKm: setDistanceKm,
    sleepHours: setSleepHours,
    weightKg: setWeightKg,
    waterMl: setWaterMl,
    fastingHours: setFastingHours,
    fastingGoal: setFastingGoal,
    mealQuery: setMealQuery
  };

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lastPeriodStart,
        cycleLength,
        periodLength,
        symptoms,
        notes,
        energy,
        waterCups,
        history,
        steps,
        activeMinutes,
        activityCalories,
        distanceKm,
        sleepHours,
        weightKg,
        waterMl,
        fastingHours,
        fastingGoal,
        mealQuery
      })
    );
  }, [lastPeriodStart, cycleLength, periodLength, symptoms, notes, energy, waterCups, history, steps, activeMinutes, activityCalories, distanceKm, sleepHours, weightKg, waterMl, fastingHours, fastingGoal, mealQuery]);

  const cycleData = useMemo(() => {
    const lastStart = startOfDay(new Date(lastPeriodStart));
    const cycleDay = getCycleDay(today, lastStart, cycleLength);
    const ovulationDay = Math.max(10, cycleLength - 14);
    const phaseKey = getPhase(cycleDay, periodLength, ovulationDay);
    const nextPeriodStart = addDays(lastStart, cycleLength * Math.ceil((diffDays(today, lastStart) + 1) / cycleLength));
    const ovulationDate = addDays(nextPeriodStart, -(cycleLength - ovulationDay));
    const fertileStart = addDays(ovulationDate, -4);
    const fertileEnd = addDays(ovulationDate, 1);
    const predictedPeriodEnd = addDays(nextPeriodStart, periodLength - 1);
    return {
      cycleDay,
      ovulationDay,
      phaseKey,
      phase: phases[phaseKey],
      chance: getPregnancyChance(cycleDay, ovulationDay),
      nextPeriodStart,
      predictedPeriodEnd,
      ovulationDate,
      fertileStart,
      fertileEnd,
      lastStart
    };
  }, [today, lastPeriodStart, cycleLength, periodLength]);

  const calendarDays = useMemo(() => buildMonthGrid(viewDate), [viewDate]);
  const filteredFoods = foodIdeas[cycleData.phaseKey].filter(item => item.toLowerCase().includes(mealQuery.toLowerCase()));
  const fastingProgress = Math.min(100, Math.round((fastingHours / Math.max(1, fastingGoal)) * 100));

  function toggleSymptom(symptom) {
    setSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  }

  function saveCheckIn() {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      phase: cycleData.phase.label,
      symptoms,
      notes,
      energy,
      waterCups,
      steps,
      sleepHours
    };
    setHistory(prev => [entry, ...prev].slice(0, 12));
  }

  function phaseForDate(date) {
    const cycleDay = getCycleDay(date, cycleData.lastStart, cycleLength);
    const key = getPhase(cycleDay, periodLength, cycleData.ovulationDay);
    return key;
  }

  return (
    <div className="app-shell">
      <div className="container">
        <section className={`hero ${cycleData.phaseKey}`}>
          <div>
            <div className="eyebrow">{cycleData.phase.label} phase</div>
            <h1>Day {cycleData.cycleDay}</h1>
            <p>{cycleData.phase.summary}</p>
            <div className="chips">
              <span>Ovulation: {formatDate(cycleData.ovulationDate)}</span>
              <span>Fertile window: {formatDate(cycleData.fertileStart)} – {formatDate(cycleData.fertileEnd)}</span>
              <span>Next period: {formatDate(cycleData.nextPeriodStart)}</span>
            </div>
          </div>
          <div className="hero-card">
            <div className="small-label">Chance of pregnancy</div>
            <div className="chance-row">
              <strong>{cycleData.chance.label}</strong>
              <span>{cycleData.chance.value}%</span>
            </div>
            <div className="progress"><span style={{ width: `${cycleData.chance.value}%` }} /></div>
            <p className="muted">{cycleData.chance.note}</p>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head between">
            <div>
              <h2>Cycle calendar</h2>
              <p className="muted">Predicted period, fertile window, and ovulation estimate.</p>
            </div>
            <div className="month-nav">
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>‹</button>
              <strong>{formatMonth(viewDate)}</strong>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>›</button>
            </div>
          </div>
          <div className="weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}</div>
          <div className="calendar-grid">
            {calendarDays.map(date => {
              const phaseKey = phaseForDate(date);
              const classNames = ['day-cell', phaseKey];
              if (date.getMonth() !== viewDate.getMonth()) classNames.push('faded');
              if (sameDay(date, today)) classNames.push('today');
              if (date >= cycleData.nextPeriodStart && date <= cycleData.predictedPeriodEnd) classNames.push('predicted-period');
              if (date >= cycleData.fertileStart && date <= cycleData.fertileEnd) classNames.push('fertile');
              if (sameDay(date, cycleData.ovulationDate)) classNames.push('ovulation');
              return <div key={date.toISOString()} className={classNames.join(' ')}>{date.getDate()}</div>;
            })}
          </div>
        </section>

        <div className="tabs">
          {['plan', 'symptoms', 'predictions', 'stats', 'wellness', 'settings'].map(name => (
            <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>
          ))}
        </div>

        {tab === 'plan' && (
          <section className="card-grid four">
            <div className="panel"><h3>Supplements</h3><ul>{cycleData.phase.supplements.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div className="panel"><h3>Diet</h3><ul>{cycleData.phase.diet.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div className="panel"><h3>Exercise</h3><ul>{cycleData.phase.exercise.map(item => <li key={item}>{item}</li>)}</ul></div>
            <div className="panel"><h3>Optimize this phase</h3><p>{cycleData.phase.optimize}</p></div>
          </section>
        )}

        {tab === 'symptoms' && (
          <section className="card-grid two">
            <div className="panel">
              <h3>Daily check-in</h3>
              <div className="pill-grid">
                {symptomOptions.map(symptom => (
                  <button key={symptom} className={`pill ${symptoms.includes(symptom) ? 'selected' : ''}`} onClick={() => toggleSymptom(symptom)}>{symptom}</button>
                ))}
              </div>
              <div className="field-grid two">
                <label>Energy {energy}%<input type="range" min="0" max="100" value={energy} onChange={e => setEnergy(Number(e.target.value))} /></label>
                <label>Water {waterCups} cups<input type="range" min="1" max="12" value={waterCups} onChange={e => setWaterCups(Number(e.target.value))} /></label>
              </div>
              <label>Notes<textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How are you feeling today?" /></label>
              <button className="primary" onClick={saveCheckIn}>Save check-in</button>
            </div>
            <div className="panel">
              <h3>Recent check-ins</h3>
              {history.length === 0 ? <p className="muted">No check-ins saved yet.</p> : history.map(entry => (
                <div key={entry.id} className="history-item">
                  <div className="between"><strong>{new Date(entry.date).toLocaleDateString()}</strong><span>{entry.phase}</span></div>
                  <div className="muted">Energy {entry.energy}% · Water {entry.waterCups} cups · Steps {entry.steps}</div>
                  <div className="muted">Sleep {entry.sleepHours} hrs</div>
                  <div>{entry.symptoms.join(', ')}</div>
                  {entry.notes ? <p className="muted">{entry.notes}</p> : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'predictions' && (
          <section className="card-grid four">
            <div className="panel stat-card"><h3>Current phase</h3><strong>{cycleData.phase.label}</strong><p>{cycleData.phase.summary}</p></div>
            <div className="panel stat-card"><h3>Predicted ovulation</h3><strong>{formatDate(cycleData.ovulationDate)}</strong><p>Estimate based on cycle length.</p></div>
            <div className="panel stat-card"><h3>Fertile window</h3><strong>{formatDate(cycleData.fertileStart)} – {formatDate(cycleData.fertileEnd)}</strong><p>Planning estimate only.</p></div>
            <div className="panel stat-card"><h3>Next period</h3><strong>{formatDate(cycleData.nextPeriodStart)}</strong><p>Estimated {periodLength}-day bleed window.</p></div>
          </section>
        )}

        {tab === 'stats' && (
          <section className="card-grid two">
            <div className="panel">
              <h3>Phase performance snapshot</h3>
              <div className="bar-list">
                {[
                  ['Menstrual', 35],
                  ['Follicular', 74],
                  ['Ovulation', 88],
                  ['Luteal', 58]
                ].map(([label, value]) => (
                  <div key={label} className="bar-row">
                    <span>{label}</span>
                    <div className="progress"><span style={{ width: `${value}%` }} /></div>
                    <strong>{value}%</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <h3>Today’s summary</h3>
              <ul>
                <li>Steps: {steps.toLocaleString()}</li>
                <li>Active time: {activeMinutes} mins</li>
                <li>Activity calories: {activityCalories}</li>
                <li>Sleep: {sleepHours} hrs</li>
                <li>Water: {waterMl} ml</li>
              </ul>
            </div>
          </section>
        )}

        {tab === 'wellness' && (
          <section className="stack">
            <div className="card-grid three">
              <div className="panel metric"><h3>Steps</h3><strong>{steps.toLocaleString()}</strong><div className="muted">/ 10,000</div><div className="progress"><span style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }} /></div></div>
              <div className="panel metric"><h3>Active time</h3><strong>{activeMinutes}</strong><div className="muted">/ 90 mins</div><div className="progress"><span style={{ width: `${Math.min(100, (activeMinutes / 90) * 100)}%` }} /></div></div>
              <div className="panel metric"><h3>Activity calories</h3><strong>{activityCalories}</strong><div className="muted">/ 300 kcal</div><div className="progress"><span style={{ width: `${Math.min(100, (activityCalories / 300) * 100)}%` }} /></div></div>
            </div>

            <div className="card-grid two">
              <div className="panel">
                <h3>Health tracking</h3>
                <div className="field-grid two compact">
                  <label>Steps<input type="number" value={steps} onChange={e => setSteps(Number(e.target.value) || 0)} /></label>
                  <label>Active mins<input type="number" value={activeMinutes} onChange={e => setActiveMinutes(Number(e.target.value) || 0)} /></label>
                  <label>Calories<input type="number" value={activityCalories} onChange={e => setActivityCalories(Number(e.target.value) || 0)} /></label>
                  <label>Distance km<input type="number" step="0.1" value={distanceKm} onChange={e => setDistanceKm(Number(e.target.value) || 0)} /></label>
                  <label>Sleep hrs<input type="number" step="0.1" value={sleepHours} onChange={e => setSleepHours(Number(e.target.value) || 0)} /></label>
                  <label>Weight kg<input type="number" step="0.1" value={weightKg} onChange={e => setWeightKg(Number(e.target.value) || 0)} /></label>
                </div>
                <div className="water-row">
                  <div>
                    <strong>{waterMl} / 2000 ml</strong>
                    <div className="progress"><span style={{ width: `${Math.min(100, (waterMl / 2000) * 100)}%` }} /></div>
                  </div>
                  <div className="button-row">
                    <button className="primary" onClick={() => setWaterMl(v => Math.min(2000, v + 250))}>+ 250 ml</button>
                    <button onClick={() => setWaterMl(0)}>Reset</button>
                  </div>
                </div>
              </div>

              <div className="panel">
                <h3>Food and fasting</h3>
                <label>Food search<input type="text" value={mealQuery} onChange={e => setMealQuery(e.target.value)} placeholder="Search food or meal" /></label>
                <div className="food-grid">
                  {(filteredFoods.length ? filteredFoods : foodIdeas[cycleData.phaseKey]).map(item => <div key={item} className="food-chip">{item}</div>)}
                </div>
                <div className="scan-row">
                  <button>Barcode scan UI</button>
                  <span className="muted">Camera/barcode integration can be added later.</span>
                </div>
                <div className="fasting-box">
                  <div className="between"><strong>Intermittent fasting</strong><span>{fastingHours}:00 elapsed</span></div>
                  <div className="progress"><span style={{ width: `${fastingProgress}%` }} /></div>
                  <div className="field-grid two compact">
                    <label>Elapsed hours<input type="number" value={fastingHours} onChange={e => setFastingHours(Number(e.target.value) || 0)} /></label>
                    <label>Goal hours<input type="number" value={fastingGoal} onChange={e => setFastingGoal(Number(e.target.value) || 0)} /></label>
                  </div>
                  <p className="muted">Many people prefer more flexibility with fasting in the late luteal and menstrual phases.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === 'settings' && (
          <section className="panel">
            <h3>Personal cycle settings</h3>
            <div className="field-grid four compact">
              <label>Last period start<input type="date" value={lastPeriodStart} onChange={e => setLastPeriodStart(e.target.value)} /></label>
              <label>Cycle length<input type="number" min="21" max="40" value={cycleLength} onChange={e => setCycleLength(Number(e.target.value) || 28)} /></label>
              <label>Period length<input type="number" min="2" max="10" value={periodLength} onChange={e => setPeriodLength(Number(e.target.value) || 5)} /></label>
              <label>Distance km<input type="number" step="0.1" value={distanceKm} onChange={e => setDistanceKm(Number(e.target.value) || 0)} /></label>
            </div>
          </section>
        )}

        <section className="panel warning">
          <strong>Important note</strong>
          <p>This app is for educational cycle estimates and wellness guidance. Real barcode scanning, wearable sync, Samsung Health integration, camera permissions, accounts, and cloud backup would need extra integration later.</p>
        </section>
      </div>
    </div>
  );
}

export default App;
