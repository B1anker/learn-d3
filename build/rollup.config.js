import typescript from 'rollup-plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import replace from 'rollup-plugin-replace'
import nodeResolve from 'rollup-plugin-node-resolve'
import sourcemaps from 'rollup-plugin-sourcemaps'
import ugliy from 'rollup-plugin-uglify'
import path from 'path'

function resolve (direction) {
  return path.join('__dirname', direction)
}

export default {
  input: resolve('../src/index.ts'),
  
  plugins: [
    typescript({
      tsconfig: resolve('../tsconfig.json')
    }),
    nodeResolve(),
    sourcemaps(),
    ugliy(),
    serve({
      contentBase: resolve('../'),
      port: 8080
    }),
    livereload({
      watch: resolve('../src'),
      verbose: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  watch: {
    include: resolve('../src/**')
  },

  output: {
    format: 'umd',
    name: 'chart',
    file: resolve('../dist/bundle.js')
  }
}