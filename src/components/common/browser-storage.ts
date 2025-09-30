const KEY = "redux";

export function loadState() {
  if (typeof window === 'undefined') return undefined;
  try {
    const serializedState = localStorage.getItem(KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

export function saveState(state: any) {
   if (typeof window === 'undefined') return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY, serializedState);
  } catch (e) {
    // ignore
  }
}
