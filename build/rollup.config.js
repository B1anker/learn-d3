import typescript from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import browsersync from 'rollup-plugin-browsersync'
import replace from 'rollup-plugin-replace'
import nodeResolve from 'rollup-plugin-node-resolve'
import sourcemaps from 'rollup-plugin-sourcemaps'
import commonjs from 'rollup-plugin-commonjs'
import ugliy from 'rollup-plugin-uglify'
import hash from 'rollup-plugin-hash'
import progress from 'rollup-plugin-progress'
import path from 'path'

function resolve (direction) {
  return path.join('__dirname', direction)
}

export default {
  input: resolve('../src/index.ts'),
  
  plugins: [
    typescript({
      tsconfig: resolve('../tsconfig.json'),
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    sourcemaps(),
    // ugliy(),
    // hash({
    //   dest: 'bundle/main.[hash].js',
    //   replace: true
    // }),
    commonjs({
      include: resolve('../node_modules/**'),
      extensions: ['.js', '.ts']
    }),
    serve({
      contentBase: resolve('../'),
      port: 8080
    }),
    // livereload({
    //   watch: resolve('../src'),
    //   verbose: true
    // }),
    browsersync({
      server: resolve('../'),
      open: false
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // progress({
    //   clearLine: true // default: true
    // })
  ],

  watch: {
    include: resolve('../src/**')
  },

  output: {
    format: 'umd',
    name: 'chart',
    file: resolve('../dist/bundle.js'),
    sourcemap: true
  }
}