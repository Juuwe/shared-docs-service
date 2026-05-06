import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'three',
        'three/examples/jsm/loaders/GLTFLoader.js',
        'three/examples/jsm/controls/OrbitControls.js'
      ],
      output: {
        globals: {
          'three': 'THREE',
          'three/examples/jsm/loaders/GLTFLoader.js': 'THREE.GLTFLoader',
          'three/examples/jsm/controls/OrbitControls.js': 'THREE.OrbitControls'
        },
      },
    },
  },
});
