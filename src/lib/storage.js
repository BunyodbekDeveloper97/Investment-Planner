const STORAGE_KEY = 'investment-planner:scenarios:v2';
const LEGACY_STORAGE_KEY = 'investment-planner:scenarios:v1';
const THEME_KEY = 'investment-planner:theme:v1';

export function loadScenarios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    const normalized = parsed
      .filter((scenario) => scenario && typeof scenario === 'object')
      .map((scenario) => ({
        id: typeof scenario.id === 'string' && scenario.id ? scenario.id : createId(),
        name: typeof scenario.name === 'string' && scenario.name.trim() ? scenario.name.trim().slice(0, 60) : 'Investment Scenario',
        input: scenario.input && typeof scenario.input === 'object' ? scenario.input : {},
        createdAt: typeof scenario.createdAt === 'string' ? scenario.createdAt : new Date().toISOString(),
      }))
      .slice(0, 12);

    if (!localStorage.getItem(STORAGE_KEY) && normalized.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    return [];
  }
}

export function saveScenarios(scenarios) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  } catch {
    // Storage can be disabled by browser privacy settings.
  }
}

export function loadTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Non-persistent theme is still usable.
  }
}

export function createId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
