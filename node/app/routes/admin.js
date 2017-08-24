import Admin from '../models/Admin'
import Registration from '../models/Registration'
import XLSX from 'xlsx'
import excel from '../../utils/excel'

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

module.exports = router => {
  'use strict'
  router.route('/verification').get((req, res, next) => {
    const sess = req.session
    if (sess.user) {
      /*
	      If session has user's info, do nothing.
	  */
      checkAdmin(sess)
        .then(() => {
          return res
            .status(202)
            .json(
              sess.user +
                'has been Logged in now! Try to fetch verification API and get the resources.'
            )
        })
        .catch(err => {
          return res.status(401).json('auth error')
        })
    } else {
      return res.status(404).json('error')
    }
  })

  router.route('/profile').post((req, res, next) => {
    const sess = req.session

    if (sess.user) {
      /*
             ****** IMPORTANT STUFF!!! ******
             MYA 31: Update the profile
             ****** IMPORTANT STUFF!!! ******
      */

      checkAdmin(sess)
        .then(() => {
          const requestBody = req.body
          const accountEmail = req.query.email

          if (accountEmail) {
            Registration.update(
              { 'delegate.email': accountEmail },
              { $set: requestBody },
              (err, result) => {
                if (err) res.status(500).json('Update registration error')
                return res.status(200).json('Update the profile successfully!')
              }
            )
          } else {
            res
              .status(401)
              .json(
                "Authentication Error: The form's email is not match the session's email! Please try to log out and log in the right account."
              )
          }
        })
        .catch(err => {
          return res.status(401).json('auth error')
        })
    } else {
      return res.status(404).json('error')
    }
  }), router.route('/excel').get((req, res, next) => {
    /*
             ****** IMPORTANT STUFF!!! ******
             APR 4: Get all profile
             ****** IMPORTANT STUFF!!! ******
             */
    const sess = req.session
    if (sess.user) {
      checkAdmin(sess)
        .then(() => {
          Registration.find({}).lean().exec((err, result) => {
            if (err) return res.json(err)
            excel(result)
              .then(wb => {
                const fileName = 'PAWEES2017ADMIN'
                // res.setHeader('Content-disposition', 'attachment; filename=123.xlsx')
                res.set('Content-Type', 'application/octet-stream')
                res.attachment(fileName + '.xlsx')
                // res.setHeader('Content-type: application/octet-stream')
                res.end(new Buffer(wb, 'binary'))
              })
              .catch(error => {
                res.send('error')
              })
          })
        })
        .catch(() => {
          res.json('no')
        })
    } else {
      res.json('no')
    }
  })
}
