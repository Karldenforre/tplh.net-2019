import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from '@/webgl/glsl/ImagePlane.vs';
import fs from '@/webgl/glsl/ImagePlane.fs';

export default class ImagePlane extends THREE.Mesh {
  constructor(width) {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(width, width * 0.666, 64, 64);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        easeTransition: {
          type: 'f',
          value: 0
        },
        noiseTex: {
          type: 't',
          value: null
        },
        imgPrevTex: {
          type: 't',
          value: null
        },
        imgNextTex: {
          type: 't',
          value: null
        },
        imgRatio: {
          type: 'v2',
          value: new THREE.Vector2(1, 0.666)
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthTest: false,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'ImagePlane';
    this.imgIndexPrev = 0;
    this.imgIndexNext = 0;
  }
  start(noiseTex, imgTexes) {
    this.imgTexes = imgTexes;
    this.material.uniforms.noiseTex.value = noiseTex;
    this.material.uniforms.imgPrevTex.value = imgTexes[0];
    this.material.uniforms.imgNextTex.value = imgTexes[1];
  }
  update(time, easeStep) {
    this.material.uniforms.time.value += time;
    this.material.uniforms.easeTransition.value = easeStep;
  }
  changeTex(index) {
    this.imgIndexPrev = this.imgIndexNext;
    this.imgIndexNext = index;
    this.material.uniforms.imgPrevTex.value = this.imgTexes[this.imgIndexPrev];
    this.material.uniforms.imgNextTex.value = this.imgTexes[this.imgIndexNext];
  }
}
