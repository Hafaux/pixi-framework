## 🎮 Simple 2D Game Framework for [PixiJS](https://pixijs.com) using [Vite⚡](https://vitejs.dev/)

<a href="https://pixi-framework.onrender.com/" target="_blank">Demo</a>

### Highlights 🌟

- Typescript
- <a href="https://c.tenor.com/Hw0aKasI6B4AAAAC/fast-blazing-fast.gif" target="_blank">Blazing fast</a> builds and HMR through Vite
- Scene management
- Automagic asset loading per scene (sounds, spritesheets, textures, spine)
- Keyboard input handling
- Spine!

## Usage 🛠️

1. Clone repository `npx degit https://github.com/Hafaux/pixi-framework.git new-folder`

2. Navigate to the new directory and install the project dependencies using `npm install`

### Spine

Place your exported spine animations in the `public/<scene>/spine` folder. The framework will automatically load them when you create the scene.

```typescript
...
const anim = new SpineAnimation("spine-name");

parent.addChild(anim);

await anim.play("anim-name");
...

```

### Commands 💻

| Command           | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `npm run start`   | Run dev server                                                       |
| `npm run build`   | Build project for production                                         |
| `npm run preview` | Preview production build (must run `build` before running `preview`) |
