import Registration from '../models/Registration'

module.exports = function (router) {

    router.route('/')
        .get(function (req, res, next) {
            /*
             === Session Demo ===
             var sess = req.session
             if (sess.views) {
             sess.views++
             res.setHeader('Content-Type', 'text/html')
             res.write('<p>views: ' + sess.user + '</p>')
             res.write('<p>views: ' + sess.views + '</p>')
             res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
             res.end()
             } else {
             sess.views = 1
             sess.user = 'yingray.lu@fuhu.com'
             res.end('welcome to the session demo. refresh!')
             }
             */
        })
        .post((req, res, next) => {
            /*
             Mar 27: Log in API
             */
            const sess = req.session
            if (sess.user) {
                /*
                 If session has user's info, do nothing.
                 */
                return res.status(202).send(sess.user + 'has been Logged in now! Try to fetch verification API and get the resources.')
            } else {
                /*
                 If session is not existed, try to search database if the email and the password are correct, and let user log in.
                 */
                Registration.find({
                    "delegate.email": req.body.email,
                    "delegate.password": req.body.password
                }, (err, result) => {
                    if (err) {
                        /*
                        Server Error
                         */
                        return res.status(500).send('Server Error')
                    } else if (result.length === 0) {
                        /*
                        Email address or password is not match the database's information.
                         */
                        return res.status(401).send('Not Found!')
                    } else {
                        /*
                        Found the data, and then set user session.
                         */
                        sess.user = req.body.email
                        return res.status(200).send(sess.user + ' Logs in successfully! Thanks!')
                    }
                })
            }
        })
}