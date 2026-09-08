# portfolioAstra

> Legendary personal portfolio — Awwwards-grade WebGL, terminal emulation, distributed architecture visualizer.

## Stack

- **Framework:** Vite + React 19 + TypeScript
- **3D / WebGL:** Three.js, React Three Fiber, custom GLSL shaders
- **Animation:** GSAP 3 (ScrollTrigger, SplitType) + Framer Motion
- **Scroll:** Lenis smooth scroll synced with GSAP ScrollTrigger
- **State:** Zustand
- **Styling:** Tailwind CSS v4 + CSS custom tokens
- **Audio:** Web Audio API procedural synthesis

## Features

1. **WebGL Kinetic Hero** - 3000-particle constellation with cursor-velocity shockwaves and GLSL noise shaders
2. **Horizontal Scroll Projects** - GSAP-pinned cinematic carousel with magnetic tilt
3. **Architecture Visualizer** - Interactive node-graph with live telemetry simulation
4. **Quake Terminal** - Full UNIX terminal emulator (Cmd+K) with autocomplete and git log
5. **Code Diff Viewer** - Before/After refactoring showcase (N+1, WebWorker, WASM)
6. **Web Audio Engine** - Procedural mechanical clicks, hover sweeps, ambient drone
7. **Wireframe X-Ray Mode** - DOM perspective 3D tilt for z-index inspection
8. **Bento Proof-of-Work** - Asymmetric grid with real architecture metrics

## Dev

```bash
npm install
npm run dev
```

## Design System

- Background: `#0A0A0A` / `#121212`
- Text: `#F5F4F2`
- Accent: `#D4FF00` (Electric Lime) - strictly one accent
- Mono: JetBrains Mono
- Sans: Space Grotesk

## Keyboard Shortcuts

- `Cmd+K` / `Ctrl+K` - Toggle terminal
- Terminal commands: `help`, `cat bio.md`, `projects --filter=distributed`, `system-check`, `curl /api/contact`, `git log --graph`, `benchmarks`, `sudo hire-me`
