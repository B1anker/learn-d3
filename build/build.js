import config from './rollup.config.prod.js'
import { rollup, watch } from 'rollup'

async function build () {
  const bundle = await rollup({
    input: config.input,
    plugins: config.plugins
  })
  await bundle.write(config.output)
}

build()