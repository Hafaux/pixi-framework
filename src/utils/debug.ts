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

  // @ts-expect-error assigning PIXI to the window object
  window.PIXI = PIXI;
};

export const Debug = {
  log,
  warn,
  init,
};
