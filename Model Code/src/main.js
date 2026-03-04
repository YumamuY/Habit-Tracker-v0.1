// @ts-check

import { getTodayKey } from "./utils/date.js";
import { loadHabits, saveHabits } from "./storage.js";
import { createHabit, toggleHabitForDate, deleteHabit } from "./habits.js";
import { renderApp } from "./ui.js";

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} createdAt
 * @property {Record<string, boolean>} records
 */

/**
 * App state lives here (main.js) per blueprint. :contentReference[oaicite:11]{index=11}
 * @type {{ habits: Habit[]; todayKey: string; error: string | null }}
 */
const state = {
  habits: [],
  todayKey: "",
  error: null,
};

/**
 * Render UI with current state.
 */
function render() {
  const root = document.getElementById("app");
  if (!root) throw new Error("#app not found");

  renderApp(root, state, {
    onAddHabit,
    onToggleToday,
    onDeleteHabit,
  });
}

/**
 * Update habits, persist to localStorage, then rerender.
 * This keeps the “after any change → save + render” rule in one place. :contentReference[oaicite:12]{index=12}
 * @param {Habit[]} nextHabits
 */
function setHabits(nextHabits) {
  state.habits = nextHabits;
  saveHabits(state.habits);
  render();
}

/**
 * Clear error message and rerender (used when input becomes valid again).
 */
function clearError() {
  if (state.error !== null) {
    state.error = null;
    render();
  }
}

/**
 * Add habit handler.
 * Validate name: must be non-empty after trim. :contentReference[oaicite:13]{index=13}
 * @param {string} name
 * @param {string} category
 */
function onAddHabit(name, category) {
  if (!name) {
    state.error = "Please enter a habit name.";
    render();
    return;
  }

  clearError();

  const habit = createHabit(name, category, state.todayKey);

  // Newest first feels nice in a simple list
  setHabits([habit, ...state.habits]);
}

/**
 * Toggle "done today" for one habit.
 * @param {string} habitId
 */
function onToggleToday(habitId) {
  clearError();
  setHabits(toggleHabitForDate(state.habits, habitId, state.todayKey));
}

/**
 * Delete habit.
 * @param {string} habitId
 */
function onDeleteHabit(habitId) {
  clearError();
  setHabits(deleteHabit(state.habits, habitId));
}

/**
 * Boot sequence (todayKey → loadHabits → render) per blueprint. :contentReference[oaicite:14]{index=14}
 */
function boot() {
  state.todayKey = getTodayKey();
  state.habits = loadHabits();
  render();
}

boot();