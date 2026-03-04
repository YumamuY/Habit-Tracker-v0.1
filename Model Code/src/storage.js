// @ts-check

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} createdAt   // "YYYY-MM-DD"
 * @property {Record<string, boolean>} records
 */

const STORAGE_KEY = "habitTracker.v0"; // per blueprint :contentReference[oaicite:4]{index=4}

/**
 * Load habits from localStorage. Returns [] if nothing is stored or parsing fails.
 * @returns {Habit[]}
 */
export function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    /** @type {unknown} */
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Minimal runtime validation (keeps app resilient if storage gets corrupted)
    /** @type {Habit[]} */
    const habits = parsed
      .filter((h) => h && typeof h === "object")
      .map((h) => /** @type {any} */ (h))
      .filter((h) => typeof h.id === "string" && typeof h.name === "string" && typeof h.category === "string")
      .map((h) => ({
        id: h.id,
        name: h.name,
        category: h.category,
        createdAt: typeof h.createdAt === "string" ? h.createdAt : "",
        records: h.records && typeof h.records === "object" ? h.records : {},
      }));

    return habits;
  } catch {
    return [];
  }
}

/**
 * Save habits to localStorage as JSON.
 * @param {Habit[]} habits
 */
export function saveHabits(habits) {
  const json = JSON.stringify(habits);
  localStorage.setItem(STORAGE_KEY, json);
}