export type KeyCallback = (data: { state: "up" | "down" }) => void;

export default class Keyboard {
  private static instance: Keyboard;
  private keyMap = new Map<string, boolean>();
  private callbacks = new Map<string, KeyCallback[]>();

  private constructor() {
    this.listenToKeyEvents();
  }

  private listenToKeyEvents() {
    document.addEventListener("keydown", (e) => this.onKeyDown(e.code));
    document.addEventListener("keyup", (e) => this.onKeyUp(e.code));
  }

  public static getInstance(): Keyboard {
    if (!Keyboard.instance) {
      Keyboard.instance = new Keyboard();
    }

    return Keyboard.instance;
  }

  public registerKey(key: string, callback?: KeyCallback): void {
    if (!this.callbacks.has(key)) {
      this.callbacks.set(key, []);
    }

    this.callbacks.get(key).push(callback);
  }

  public unregisterKey(key: string, callback?: KeyCallback): void {
    if (!this.callbacks.has(key)) return;

    const callbacks = this.callbacks.get(key);
    const index = callbacks.indexOf(callback);

    if (index !== -1) {
      callbacks.splice(index, 1);
    } else {
      callbacks.length = 0;
    }
  }

  private onKeyDown(key: string): void {
    if (this.isKeyDown(key)) return;

    this.keyMap.set(key, true);

    if (!this.callbacks.has(key)) return;

    this.callbacks.get(key).forEach((callback) => callback({ state: "down" }));
  }

  private onKeyUp(key: string): void {
    this.keyMap.set(key, false);

    if (!this.callbacks.has(key)) return;

    this.callbacks.get(key).forEach((callback) => callback({ state: "up" }));
  }

  public isKeyDown(key: string): boolean {
    return this.keyMap.get(key) ?? false;
  }
}
