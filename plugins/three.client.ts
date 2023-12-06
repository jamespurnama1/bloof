import * as THREE from "THREE";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3Drenderer";

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      THREE,
      CSS3DRenderer,
      CSS3DObject
    }
  }
});
