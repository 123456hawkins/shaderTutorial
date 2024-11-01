<template>
  <div class="pageContainer" ref="pageRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";

const pageRef = ref<HTMLElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let plane: THREE.Mesh;
let clock: THREE.Clock;

onMounted(() => {
  // 创建场景
  scene = new THREE.Scene();

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 2;

  // 创建渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (pageRef.value) {
    pageRef.value.appendChild(renderer.domElement);
  }

  // 创建着色器材料
  const vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    vec4 red(){
    // 注意不能输入整型，必须带.
      return vec4(1.0,0.0,0.0,1.0);
    }
    void main() {

      // gl_FragColor = vec4(0.545 + 0.5 * sin(u_time), 1.000, 0.570, 1.000); // 根据时间变化颜色
      gl_FragColor=red();
    }


  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0 }
    }
  });

  // 创建平面几何体
  const geometry = new THREE.PlaneGeometry(1, 1);
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  // 创建时钟
  clock = new THREE.Clock();

  // 动画循环
  const animate = () => {
    requestAnimationFrame(animate);
    // const delta = clock.getDelta(); // 获取时间增量
    // material.uniforms.u_time.value += delta; // 更新 uniform 变量
    // plane.rotation.z += 0.01; // 旋转平面
    renderer.render(scene, camera);
  };
  animate();

  // 处理窗口调整
  window.addEventListener("resize", onWindowResize);
});

onBeforeUnmount(() => {
  // 清理
  if (renderer) {
    renderer.dispose();
  }
  window.removeEventListener("resize", onWindowResize);
});

const onWindowResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};
</script>

<style scoped>
.pageContainer {
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* 防止滚动条 */
}
</style>
