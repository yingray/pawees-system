import Admin from '../models/Admin'
import Registration from '../models/Registration'
import requestBodyToModelBody, { firstAuthor } from '../../utils/requestBodyToModelBody'
import ConvertPdf from '../../utils/convertPdf'

const getFilename = (a, b) => {
  const str = `${a} - ${b}`
  return str.replace(/[^A-Za-z0-9\-\ ]/g, '')
}

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
    try {
      const sess = req.session
      const { email } = req.params
      if (sess.user) {
        checkAdmin(sess)
          .then(() => {
            Registration.find({ 'delegate.email': email }, (err, result) => {
              if (err) throw err
              if (result[0] && result[0].paper && result[0].paper.title && result[0].paper.authors && result[0].paper.affiliations && result[0].paper.abstract && result[0].paper.keywords) {
                const { paper } = result[0]
                const filename = getFilename(firstAuthor(paper.authors), paper.title)
                const link = filename ? `/papers/${filename}.pdf` : ''

                ConvertPdf(filename, paper)
                  .then(response => {
                    console.log('========== CONVERT SUCCESSFULLY ==========', response)
                    Registration.update(
                      { 'delegate.email': email },
                      { $set: { 'paper.link': link } },
                      (e3, r3) => {
                        if (e3) throw e3
                        return res.status(202).json(r3)
                      }
                    )
                  })
                  .catch(e2 => {
                    console.log('========== CONVERT ERR ==========', e2)
                    throw "Convert PDF Error: Server's converter error! Please inform the admin to fix it."
                  })
              } else {
                return res.status(200).json('OK')
              }
            })
          })
          .catch(err => {
            return res.status(401).json('auth error')
          })
      } else {
        return res.status(404).json('error')
      }
    } catch (e) {
      return res.status(500).json('server error')
    }
  })
}
