/// <reference types="vite/client" />

// GLSL shader string imports
declare module '*.glsl' {
  const src: string
  export default src
}

declare module '*.vert' {
  const src: string
  export default src
}

declare module '*.frag' {
  const src: string
  export default src
}
