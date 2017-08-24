import changeCase from 'change-case'
import express from 'express'
import requireDir from 'require-dir'
import _ from 'lodash'

module.exports = function(app) {
  'use strict'
  const routes = requireDir()
  // Initialize all routes
  _.mapKeys(routes, (obj, route) => {
    const router = express.Router()
    // You can add some middleware here
    // router.use(someMiddleware);

    // Initialize the route to add its functionality to router
    require('./' + route)(router)

    // Add router to the speficied route name in the app
    app.use('/api/' + changeCase.paramCase(route), router)
  })
}
