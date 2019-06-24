import path from 'path'

import fs from 'fs-extra'
import webpack from 'webpack'
import colors from 'colors'

import config from './webpack.config.babel'
import appConfig from './config/webpack'

async function run() {
  console.log('[ + ] Start compiling')

  const stats = await compile()

  console.log(
    `[ + ] Webpack compile is complete in ${stats.time / 1000} seconds`.magenta
  )

  fs.copySync(
    path.join(appConfig.compile.entry, appConfig.compile.publicDirName),
    path.join(appConfig.compile.output, appConfig.compile.publicDirName)
  )

  console.log('[ + ] Static assets are copied'.magenta)

  fs.copySync(
    path.join(appConfig.compile.entry, 'static/pages/terms/index.html'),
    path.join(appConfig.compile.output, 'terms/index.html')
  )

  fs.copySync(
    path.join(appConfig.compile.entry, 'static/pages/terms/mls/index.html'),
    path.join(appConfig.compile.output, 'terms/mls/index.html')
  )

  fs.copySync(
    path.join(appConfig.compile.entry, 'static/pages/privacy/index.html'),
    path.join(appConfig.compile.output, 'privacy/index.html')
  )

  console.log('[ + ] Template files copied'.magenta)
}

function compile() {
  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }

      const jsonStats = stats.toJson(true)

      if (jsonStats.errors.length > 0) {
        console.log('[ * ] Webpack compiler encountered errors.'.red)
        console.log(colors.red(jsonStats.errors.join('\n')))

        return reject(new Error('Webpack compiler encountered errors'))
      }

      if (jsonStats.warnings.length > 0) {
        console.log('[ ! ] Webpack compiler encountered warnings.'.yellow)
        console.log(colors.yellow(jsonStats.warnings.join('\n')))
      }

      return resolve(jsonStats)
    })
  })
}

run().catch(e => {
  console.error('error in build:', e)
  process.exit(1)
})
