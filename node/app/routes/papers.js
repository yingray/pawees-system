import Admin from '../models/Admin'
import Registration from '../models/Registration'

const checkAdmin = sess =>
  new Promise((resolve, reject) => {
    Admin.find({ email: sess.user }, (err, result) => {
      if (err) reject('err')
      if (result.length !== 0) {
        resolve(result)
      } else {
        reject('not existed')
      }
    })
  })

module.exports = function(router) {
  'use strict'
  router.route('/:email').post((req, res, next) => {
    const sess = req.session
    if (sess.user) {
      checkAdmin(sess)
        .then(() => {
          return res.status(202).json(req.params.email)
        })
        .catch(err => {
          return res.status(401).json('auth error')
        })
    } else {
      return res.status(404).json('error')
    }
  })
}
