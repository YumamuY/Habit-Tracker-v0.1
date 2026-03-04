// @ts-check

/**
 * Pads a number with a leading zero when needed (e.g. 3 -> "03").
 * @param {number} n
 * @returns {string}
 */
function pad2(n) {
  return String(n).padStart(2, "0");
}

/**
 * Returns today's date key in LOCAL timezone as "YYYY-MM-DD".
 * (We avoid toISOString() because that uses UTC.)
 * @returns {string}
 */
export function getTodayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Optional: a friendly label like "Mar 4, 2026" from "YYYY-MM-DD".
 * @param {string} dateKey
 * @returns {string}
 */
export function formatDateLabel(dateKey) {
  // Defensive parsing: "YYYY-MM-DD" -> Date(YYYY, MM-1, DD) in local tz
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}