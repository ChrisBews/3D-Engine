import typescript from 'rollup-plugin-typescript2';

export default {
  entry: './src/index.ts',
  dest: './dist/oomph3d.min.js',
  output: {
    format: 'iife',
    name: 'Oomph3D',
    sourcemap: true,
  },
  plugins: [
    typescript()
  ]
}