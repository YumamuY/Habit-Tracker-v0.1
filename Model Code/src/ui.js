// @ts-check

import { formatDateLabel } from "./utils/date.js";

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} createdAt
 * @property {Record<string, boolean>} records
 */

/**
 * @typedef {Object} AppState
 * @property {Habit[]} habits
 * @property {string} todayKey
 * @property {string | null} error
 */

/**
 * @typedef {Object} AppHandlers
 * @property {(name: string, category: string) => void} onAddHabit
 * @property {(habitId: string) => void} onToggleToday
 * @property {(habitId: string) => void} onDeleteHabit
 */

const CATEGORIES = ["Health", "Study", "Exercise", "Mindfulness", "Other"];

/**
 * Render the whole app into the root element.
 * UI stays stateless: it renders from state and calls handlers (main owns state). 
 * @param {HTMLElement} rootEl
 * @param {AppState} state
 * @param {AppHandlers} handlers
 */
export function renderApp(rootEl, state, handlers) {
  rootEl.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="header">
          <h1 class="title">Habit Tracker</h1>
          <div class="subtle">Today: ${escapeHtml(formatDateLabel(state.todayKey))}</div>
        </div>

        <form class="form" data-testid="add-form" autocomplete="off">
          <input
            class="input"
            name="habitName"
            type="text"
            placeholder="Add a habit (e.g. Read 10 pages)"
            aria-label="Habit name"
            maxlength="60"
            required
          />

          <select class="select" name="category" aria-label="Category">
            ${CATEGORIES.map((c) => `<option value="${escapeAttr(c)}">${escapeHtml(c)}</option>`).join("")}
          </select>

          <button class="button" type="submit">Add</button>
        </form>

        ${state.error ? `<div class="error" role="alert">${escapeHtml(state.error)}</div>` : ""}

        <div class="list" data-testid="habit-list">
          ${renderHabitList(state.habits, state.todayKey)}
        </div>
      </div>

      <div class="footer-note">
        Data is saved in your browser (localStorage). Reloading should keep your habits.
      </div>
    </div>
  `;

  // Wire up events (new DOM each render → no duplicate listeners)
  const form = /** @type {HTMLFormElement | null} */ (rootEl.querySelector("form[data-testid='add-form']"));
  const listEl = /** @type {HTMLElement | null} */ (rootEl.querySelector("[data-testid='habit-list']"));

  if (!form || !listEl) return;

  // Add habit (validate trimmed, non-empty name)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get("habitName") || "").trim();
    const category = String(fd.get("category") || "Other");

    handlers.onAddHabit(name, category);

    // Clear input and keep category
    const input = /** @type {HTMLInputElement | null} */ (form.querySelector("input[name='habitName']"));
    if (input) input.value = "";
    input?.focus();
  });

  // Event delegation for toggle + delete (preferred)
  listEl.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.dataset.action !== "toggle") return;

    const habitId = target.dataset.id;
    if (!habitId) return;

    handlers.onToggleToday(habitId);
  });

  listEl.addEventListener("click", (e) => {
    const el = /** @type {HTMLElement} */ (e.target instanceof HTMLElement ? e.target : null);
    if (!el) return;

    const deleteBtn = el.closest("button[data-action='delete']");
    if (!(deleteBtn instanceof HTMLButtonElement)) return;

    const habitId = deleteBtn.dataset.id;
    if (!habitId) return;

    handlers.onDeleteHabit(habitId);
  });
}

/**
 * Render habit rows.
 * @param {Habit[]} habits
 * @param {string} todayKey
 * @returns {string}
 */
function renderHabitList(habits, todayKey) {
  if (habits.length === 0) {
    return `<div class="empty">No habits yet. Add your first one above ✨</div>`;
  }

  return habits
    .map((h) => {
      const done = Boolean(h.records?.[todayKey]);

      return `
        <div class="habit" data-habit-id="${escapeAttr(h.id)}">
          <div class="habit-main">
            <div class="habit-name">${escapeHtml(h.name)}</div>
            <span class="badge">${escapeHtml(h.category)}</span>
          </div>

          <div class="habit-actions">
            <label class="checkbox">
              <input
                type="checkbox"
                data-action="toggle"
                data-id="${escapeAttr(h.id)}"
                ${done ? "checked" : ""}
              />
              Done today
            </label>

            <button
              class="icon-button"
              type="button"
              data-action="delete"
              data-id="${escapeAttr(h.id)}"
              aria-label="Delete habit"
              title="Delete"
            >
              Delete
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Escape text content for safe HTML insertion.
 * @param {string} s
 * @returns {string}
 */
function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Escape attribute values (minimal).
 * @param {string} s
 * @returns {string}
 */
function escapeAttr(s) {
  // Reuse same escaping for simplicity
  return escapeHtml(s);
}