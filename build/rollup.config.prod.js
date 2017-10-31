import typescript from 'rollup-plugin-typescript2'
import replace from 'rollup-plugin-replace'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import ugliy from 'rollup-plugin-uglify'
import progress from 'rollup-plugin-progress'
import alias from 'rollup-plugin-alias';
import ejs from 'rollup-plugin-ejs';
import scss from 'rollup-plugin-scss'
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
    alias({
      '@': resolve('../src')
    }),
    scss({
      output: resolve('../dist/h3.min.css')
    }),
    ejs({
      include: ['**/*.ejs', '**/*.html'],
      exclude: ['**/index.html'],
      compilerOptions: {
        client: true
      }
    }),
    ugliy(),
    commonjs({
      include: resolve('../node_modules/**'),
      extensions: ['.js', '.ts']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    progress({
      clearLine: true // default: true
    })
  ],

  output: {
    format: 'umd',
    name: 'chart',
    file: resolve('../dist/h3.min.js')
  }
}