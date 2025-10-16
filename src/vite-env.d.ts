/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.gltf' {
  const src: string;
  export default src;
}
declare module '*.geojson' {
  const value: any;
  export default value;
}
