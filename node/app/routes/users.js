import Admin from '../models/Admin'
import Registration from '../models/Registration'
import requestBodyToModelBody, { firstAuthor } from '../../utils/requestBodyToModelBody'
import ConvertPdf from '../../utils/convertPdf'

const checkAdmin = sess =>
  new Promise((resolve, reject) => {
    Admin.find({ email: sess.user }, (err, result) => {
      if (err) reject('err')
      if(result.length !== 0) {
        resolve(result)
      } else {
        reject('not existed')
      }
    })
  })

module.exports = function (router) {
    'use strict'

    router.route('/:email')
        .get(function (req, res, next) {
            /*
             Mar 27: Check user which existed
             */
            Registration.find({ "delegate.email": req.params.email }, (err, user_info) => {
                if (err) return next
                if (user_info.length === 0) {
                    return res.send('email is not existed')
                } else {
                    return res.json('existed')
                }

            })
        })

    router.route('/')
        .get(function(req, res, next) {
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
                        // var json2csv = require('json2csv');
                        // var csv = json2csv({ data: result, fields: [ 'delegate.title' ] });
                        // console.log(csv)
                        return res.json(result)
                    })
                })
                .catch(() => { res.json('no') })
			} else {
			    res.json('no')
            }
        })
        .post(function (req, res, next) {
            /*
             ****** IMPORTANT STUFF!!! ******
             Mar 27: Update the profile
             ****** IMPORTANT STUFF!!! ******
             */
            const sess = req.session
            const requestBody = req.body
            /*
             Step 1. Check account status:
             * Detect if session exists?
             * Check if session's email matches the request's email?
             */
            if (sess.user && sess.user === requestBody.delegate.email) {
                /*
                 Step 3. Update the profile to database.
                 */
                const updateProfile = editTime => new Promise((resolve, reject) => {
                    Registration.update({
                        "delegate.email": sess.user
                    }, { $set: requestBodyToModelBody(requestBody, editTime) }, (err, result) => {
                        if (err) reject(err);
                        return resolve("Update the profile successfully!")
                    })
                })
                /*
                 Step 2. Convert the abstract content to PDF format and save in the file system. And then do the step 3.
                 * Check if the request's title exists?
                 * Yes => Convert
                 * Put the first author to the file name.
                 * Successfully => Step 3.
                 * Fail => Response user that we converter error!
                 * No => Step 3.
                 */
                if (requestBody.paper.title && requestBody.paper.authors && requestBody.paper.affiliations && requestBody.paper.abstract && requestBody.paper.keywords ) {
					const editTime = Date.now();
                    const filename = `${firstAuthor(requestBody.paper.authors)} - ${requestBody.paper.title} ${editTime}`
                    ConvertPdf(filename, requestBody.paper)
                        .then(response => {
                            console.log('========== CONVERT SUCCESSFULLY ==========', response)
                            updateProfile(editTime)
                                .then(updateResponse => res.json(updateResponse))
                                .catch(err => res.status(401).send(err))
                        })
                        .catch(err => {
                            console.log('========== CONVERT ERR ==========', err)
                            return res.status(500).json('Convert PDF Error: Server\'s converter error! Please inform the admin to fix it.')
                        })
                } else {
                    updateProfile()
                        .then(updateResponse => res.json(updateResponse))
                        .catch(err => res.status(401).send(err))
                }

            } else {
                res.status(401).json('Authentication Error: The form\'s email is not match the session\'s email! Please try to log out and log in the right account.')
            }


        })
        .put(function (req, res, next) {
            /*
             === Mar 27: Backup the recaptcha ===
             var recaptchaValidate = require('../../lib/recaptcha');
             recaptchaValidate(req.body['g-recaptcha-response'])
             .then(() => {
             const email = req.body.email
             DelegateInfo.find((err, t) => {
             if (err) return next()
             }).exec().then(list => {
             let registered = false
             _.map(list, l => {
             if (email === l.email) {
             registered = true
             }
             })
             if (registered) {
             console.log('registered account!')
             return res.status(401).send('Register')
             } else {
             // Do Create
             }
             });
             })
             .catch(() => {
             res.status(401).send('recaptcha expired')
             })
             */
        });
};