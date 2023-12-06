import * as THREE from "three";
//@ts-ignore
import { CSS3DRenderer, CSS3DObject } from 'three/addons';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      THREE,
      CSS3DRenderer,
      CSS3DObject
    }
  }
});
