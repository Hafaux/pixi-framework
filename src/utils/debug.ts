const log = (...messages: unknown[]) => {
  if (!import.meta.env.DEV) return;

  console.log("[DEBUG LOG]:", ...messages);
};

const warn = (...messages: unknown[]) => {
  if (!import.meta.env.DEV) return;

  console.warn("[DEBUG WARN]:", ...messages);
};

/**
 * Add PIXI and the SceneManager to the Global scope.
 */
const init = async () => {
  const PIXI = await import("pixi.js");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).PIXI = PIXI;
};

export const debug = {
  log,
  warn,
  init,
};
