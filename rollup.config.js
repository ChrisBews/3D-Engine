import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: {
    file: './dist/oomph3d.min.js',
    format: 'iife',
    name: 'Oomph3D',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    babel({
      presets: [
        [
          "env",
          {
            modules: false,
          },
        ],
      ],
      plugins: [
        'external-helpers'
      ],
      externalHelpers: true,
      exclude: 'node_modules/**',
    }),
  ]
}