const activityCallbackRegistry = new Map();

export function registerActivityCallbacks(key, callbacks) {
  activityCallbackRegistry.set(key, callbacks);
}

export function getActivityCallbacks(key) {
  if (!key) return null;

  return activityCallbackRegistry.get(key) || null;
}

export function removeActivityCallbacks(key) {
  if (!key) return;

  activityCallbackRegistry.delete(key);
}