'use strict'

import express from 'express'
import path from 'path'
import config from 'nconf'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import logger from 'winston'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import router from '../../app/routes'

let app

module.exports = cb => {
  app = express()
  const mongoStore = connectMongo(session)

  const host = process.env.ENV === 'dev' ? 'mongodb://localhost:27017' : 'mongodb://mongo'

  // app.use(morgan('common'))
  app.use(morgan('dev'))

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json({ type: '*/*' }))
  app.use(cookieParser(config.get('SESSION_SECRET')))

  app.use(
    session({
      secret: config.get('SESSION_SECRET'),
      saveUninitialized: false, // don't create session until something stored
      resave: false, //don't save session if unmodified
      store: new mongoStore({ url: `${host}/pawees` })
    })
  )

  logger.info('[SERVER] Initializing routes')

  router(app)

  app.use(express.static(path.join(__dirname, 'public')))

  // Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    })
    next(err)
  })

  app.listen(config.get('NODE_PORT'))
  logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT'))

  app.use(
    '*',
    cors({
      origin: [
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://127.0.0.1:9000',
        'http://localhost:63342',
        'http://localhost:9000'
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: true,
      maxAge: 36000,
      credentials: true,
      optionsSuccessStatus: 200
    })
  )

  if (cb) {
    return cb()
  }
}
