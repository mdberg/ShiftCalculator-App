// Browser persistence for calculator entries (localStorage, single versioned key).

export const STORAGE_KEY = "shiftcalc:v1";

export interface PredictedValues {
  serviceWeek: number;
  serviceWeekend: number;
  jeopardyWeek: number;
  jeopardyWeekend: number;
  callNight: number;
  johnMuir: number;
}

export interface SavedState {
  fte: number;
  weekdayShifts: number[];
  weekendShifts: number[];
  conversionShifts: number[];
  johnMuirShifts: number[];
  // Only set when the user has manually edited the Predictive Analytics values;
  // otherwise suggestions are recomputed from the remaining hours.
  predicted: PredictedValues | null;
}

export const DEFAULT_STATE: SavedState = {
  fte: 1.0,
  weekdayShifts: [0, 0, 0, 0],
  weekendShifts: [0, 0, 0, 0],
  conversionShifts: [0, 0],
  johnMuirShifts: [0],
  predicted: null,
};

const PREDICTED_FIELDS: (keyof PredictedValues)[] = [
  "serviceWeek",
  "serviceWeekend",
  "jeopardyWeek",
  "jeopardyWeekend",
  "callNight",
  "johnMuir",
];

const isValidNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;

const sanitizeArray = (v: unknown, fallback: number[]): number[] =>
  Array.isArray(v) && v.length === fallback.length && v.every(isValidNumber)
    ? [...v]
    : [...fallback];

const sanitizePredicted = (v: unknown): PredictedValues | null => {
  if (!v || typeof v !== "object") return null;
  const obj = v as Record<string, unknown>;
  if (!PREDICTED_FIELDS.every((f) => isValidNumber(obj[f]))) return null;
  return Object.fromEntries(
    PREDICTED_FIELDS.map((f) => [f, obj[f] as number]),
  ) as unknown as PredictedValues;
};

let cache: SavedState | null = null;

export function loadState(): SavedState {
  if (cache) return cache;
  let parsed: Record<string, unknown> = {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const value = JSON.parse(raw);
      if (value && typeof value === "object") parsed = value;
    }
  } catch {
    // Missing, blocked, or corrupt storage: fall back to defaults.
  }
  cache = {
    fte: isValidNumber(parsed.fte) ? parsed.fte : DEFAULT_STATE.fte,
    weekdayShifts: sanitizeArray(parsed.weekdayShifts, DEFAULT_STATE.weekdayShifts),
    weekendShifts: sanitizeArray(parsed.weekendShifts, DEFAULT_STATE.weekendShifts),
    conversionShifts: sanitizeArray(parsed.conversionShifts, DEFAULT_STATE.conversionShifts),
    johnMuirShifts: sanitizeArray(parsed.johnMuirShifts, DEFAULT_STATE.johnMuirShifts),
    predicted: sanitizePredicted(parsed.predicted),
  };
  return cache;
}

const isDefault = (s: SavedState): boolean =>
  JSON.stringify(s) === JSON.stringify(DEFAULT_STATE);

export function saveState(partial: Partial<SavedState>): void {
  cache = { ...loadState(), ...partial };
  try {
    if (isDefault(cache)) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    }
  } catch {
    // Storage unavailable (e.g. private mode quota): keep working in memory.
  }
}

export function clearState(): void {
  cache = {
    ...DEFAULT_STATE,
    weekdayShifts: [...DEFAULT_STATE.weekdayShifts],
    weekendShifts: [...DEFAULT_STATE.weekendShifts],
    conversionShifts: [...DEFAULT_STATE.conversionShifts],
    johnMuirShifts: [...DEFAULT_STATE.johnMuirShifts],
  };
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
