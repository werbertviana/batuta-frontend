import { BackHandler } from "react-native";

if (BackHandler && typeof BackHandler.removeEventListener !== "function") {
  const originalAdd = BackHandler.addEventListener?.bind(BackHandler);

  BackHandler.addEventListener = (eventName, handler) => {
    const sub = originalAdd ? originalAdd(eventName, handler) : null;

    if (handler && typeof handler === "function") {
      handler.__bhSub = sub;
    }

    return sub;
  };

  BackHandler.removeEventListener = (_eventName, handler) => {
    try {
      const sub = handler?.__bhSub;
      if (sub && typeof sub.remove === "function") {
        sub.remove();
      }
    } catch (_e) {
    }
  };
}
