import Registration from '../models/Registration'

const message = {
	notFound: 'User is not found!',
    error: 'verification error!'
}

module.exports = function(router) {
    router.route('/')
        .get((req, res) => {
            /*
                Mar 26: Verification API
             */
            const sess = req.session
            if (sess.user) {
                Registration.find({
                    "delegate.email": sess.user
                }, (err, result) => {
                    if(err) return res.status(500).send(message.error)
                    /*
                        Send the profile data(result).
                    */
                    return res.status(200).json(result)
                })
            } else {
                return res.status(204).send(message.notFound)
            }
        })
}