import config from './rollup.config.dev.js'
import { rollup, watch } from 'rollup'

const watcher = watch({
  input: config.input,
  plugins: config.plugins,
  watch: config.watch,
  output: [config.output]
})

watcher.on('event', (e) => {
  if (e.code === 'START') {
    console.log('compilling...')
  } else if (e.code === 'END') {
    console.log('finish')
  } else if (e.code === 'FATAL') {
    console.log(e)
  }
})
