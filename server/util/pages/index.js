import Koa from 'koa'
import mount from 'koa-mount'
import config from '../../../config/private'
const _ = require('underscore')

const app = new Koa()

const routes = {
  app: [
    [ 'home' ],
    [ 'signin' ],
    [ 'signup' ],
    [ 'signout' ],
    [ 'terms' ],
    [ 'mls' ],
    [ 'recent' ],
    [ 'dashboard' ],
    [ 'widget' ],
    [ 'invite' ],
    [ 'reset-password' ]
  ],
  verify: [
    [ 'email' ],
    [ 'activate' ],
    [ 'phone' ]
  ]
}

app.use(async function(ctx, next) {
  ctx.config = config
  const { AppStore } = ctx.locals

  console.log('1=>', ctx.session.user)
  if(!ctx.session.user){
    delete AppStore.data.user
  } else {
    AppStore.data = {
      ...AppStore.data,
      ...{
        user: ctx.session.user
      }
    }
  }

  ctx.locals.AppStore = AppStore

  await next()
})

_.each(routes, (group, name) => {
  _.each(group, rt => {
    app.use(mount(require(`./${name}/${rt[0]}`)))
  })
})

module.exports = app
