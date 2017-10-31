import typescript from 'rollup-plugin-typescript2'
import browsersync from 'rollup-plugin-browsersync'
import replace from 'rollup-plugin-replace'
import nodeResolve from 'rollup-plugin-node-resolve'
import sourcemaps from 'rollup-plugin-sourcemaps'
import commonjs from 'rollup-plugin-commonjs'
import progress from 'rollup-plugin-progress'
import alias from 'rollup-plugin-alias';
import ejs from 'rollup-plugin-ejs';
import sass from 'rollup-plugin-sass'
import path from 'path'

function resolve (direction) {
  return path.join('__dirname', direction)
}

export default {
  input: resolve('../src/example.ts'),
  
  plugins: [
    typescript({
      tsconfig: resolve('../tsconfig.json'),
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    alias({
      '@': resolve('../src')
    }),
    sourcemaps(),
    sass({
      output: resolve('../example/bundle.css')
    }),
    ejs({
      include: ['**/*.ejs', '**/*.html'],
      exclude: ['**/index.html'],
      compilerOptions: {
        client: true
      }
    }),
    commonjs({
      include: resolve('../node_modules/**'),
      extensions: ['.js', '.ts']
    }),
    browsersync({
      server: resolve('../example'),
      open: false
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    progress({
      clearLine: true
    })
  ],

  watch: {
    include: resolve('../src/**')
  },

  output: {
    format: 'umd',
    name: 'chart',
    file: resolve('../example/bundle.js'),
    sourcemap: true
  }
}