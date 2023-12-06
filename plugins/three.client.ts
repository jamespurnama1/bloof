import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3Drenderer.js";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      THREE,
      CSS3DRenderer,
      CSS3DObject
    }
  }
});
