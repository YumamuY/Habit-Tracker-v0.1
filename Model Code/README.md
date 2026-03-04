# Habit Tracker (Version 0.1)

A small vanilla HTML/CSS/JS habit tracker for learning:
- Add habits (name + category)
- Display habits
- Toggle completion for today
- Delete habits
- Persist data with localStorage

## Tech notes
- Uses ES modules (`<script type="module">`)
- Uses `// @ts-check` + JSDoc for type checking
- Works in Chrome

## Run locally (important)
Because ES modules don’t work reliably via `file://`, run a local server:

### Option A: VS Code Live Server
1. Install the “Live Server” extension
2. Right-click `index.html` → “Open with Live Server”

### Option B: Python
From the `habit-tracker/` directory:

```bash
python3 -m http.server 5500