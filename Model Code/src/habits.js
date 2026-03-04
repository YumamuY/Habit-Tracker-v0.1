// @ts-check

/**
 * Pure logic only (NO DOM access) per blueprint. :contentReference[oaicite:5]{index=5}
 */

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} createdAt
 * @property {Record<string, boolean>} records
 */

/**
 * Create a new Habit object.
 * Uses crypto.randomUUID() as recommended by the blueprint. :contentReference[oaicite:6]{index=6}
 * @param {string} name
 * @param {string} category
 * @param {string} todayKey
 * @returns {Habit}
 */
export function createHabit(name, category, todayKey) {
  return {
    id: crypto.randomUUID(),
    name,
    category,
    createdAt: todayKey,
    records: {}, // start empty; toggling will set records[todayKey]
  };
}

/**
 * Toggle completion for one habit on a specific date key.
 * Returns a NEW array (immutable update) per blueprint. :contentReference[oaicite:7]{index=7}
 * @param {Habit[]} habits
 * @param {string} habitId
 * @param {string} dateKey
 * @returns {Habit[]}
 */
export function toggleHabitForDate(habits, habitId, dateKey) {
  return habits.map((h) => {
    if (h.id !== habitId) return h;

    const current = Boolean(h.records?.[dateKey]);
    return {
      ...h,
      records: {
        ...h.records,
        [dateKey]: !current,
      },
    };
  });
}

/**
 * Delete a habit by id (immutable).
 * @param {Habit[]} habits
 * @param {string} habitId
 * @returns {Habit[]}
 */
export function deleteHabit(habits, habitId) {
  return habits.filter((h) => h.id !== habitId);
}