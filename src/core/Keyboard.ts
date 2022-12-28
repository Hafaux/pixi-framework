import { utils } from "pixi.js";

export default class Keyboard extends utils.EventEmitter {
  private static instance: Keyboard;

  static states = {
    ACTION: "ACTION",
  };

  static actions = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    JUMP: "JUMP",
    SHIFT: "SHIFT",
  } as const;

  static actionKeyMap = {
    [Keyboard.actions.UP]: "KeyW",
    [Keyboard.actions.DOWN]: "KeyS",
    [Keyboard.actions.LEFT]: "KeyA",
    [Keyboard.actions.RIGHT]: "KeyD",
    [Keyboard.actions.JUMP]: "Space",
    [Keyboard.actions.SHIFT]: "ShiftLeft",
  } as const;

  static allKeys = Object.values(Keyboard.actionKeyMap);

  static keyActionMap = Object.entries(Keyboard.actionKeyMap).reduce(
    (acc, [key, action]) => {
      acc[action] = key as keyof typeof Keyboard.actions;

      return acc;
    },
    {} as Record<string, keyof typeof Keyboard.actionKeyMap>
  );

  private keyMap = new Map<string, boolean>();

  private constructor() {
    super();

    this.listenToKeyEvents();
  }

  private listenToKeyEvents() {
    document.addEventListener("keydown", (e) => this.onKeyPress(e.code));
    document.addEventListener("keyup", (e) => this.onKeyRelease(e.code));
  }

  public static getInstance(): Keyboard {
    if (!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }

    return Keyboard.instance;
  }

  public getAction(action: keyof typeof Keyboard.actions): boolean {
    return this.isKeyDown(Keyboard.actionKeyMap[action]);
  }

  public onAction(
    callback: (e: {
      action: keyof typeof Keyboard.actions;
      buttonState: "pressed" | "released";
    }) => void
  ): void {
    this.on(Keyboard.states.ACTION, callback);
  }

  private onKeyPress(key: string): void {
    if (this.isKeyDown(key) || !(key in Keyboard.keyActionMap)) return;

    this.keyMap.set(key, true);

    this.emit(Keyboard.states.ACTION, {
      action: Keyboard.keyActionMap[key],
      buttonState: "pressed",
    });
  }

  private onKeyRelease(key: string): void {
    if (!(key in Keyboard.keyActionMap)) return;

    this.keyMap.set(key, false);

    this.emit(Keyboard.states.ACTION, {
      action: Keyboard.keyActionMap[key],
      buttonState: "released",
    });
  }

  public isKeyDown(key: string): boolean {
    return this.keyMap.get(key) ?? false;
  }
}
