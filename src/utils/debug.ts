const log = (...messages: unknown[]) => {
  if (!import.meta.env.DEV) return;

  console.log("[DEBUG LOG]:", ...messages);
};

const warn = (...messages: unknown[]) => {
  if (!import.meta.env.DEV) return;

  console.warn("[DEBUG WARN]:", ...messages);
};

export const Debug = {
  log,
  warn,
};
