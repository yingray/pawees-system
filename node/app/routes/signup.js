import Registration from '../models/Registration'

const message = {
	signUpSuccess: 'Sign up successfully!',
	signUpFail: 'Sign up fail!',
	accountExisted: 'existed'
}

module.exports = function(router) {
	'use strict'
	router.route('/')
		.post(function(req, res) {
			/*
				Mar 26: SignUp API
			*/
			Registration.find({ "delegate.email": req.body.email })
				.exec(function(err, user_info) {
					if (err) return res.status(401).send(message.signUpFail)

					/* Check account status */
					if (user_info.length === 0) {
						const registration = new Registration({
							"delegate": {
								"email": req.body.email,
								"password": req.body.password
							}
						})
						/* Mongo SAVE */
						registration.save(function(err) {
							if (err) return res.status(500).send(message.signUpFail)
							return res.send(message.signUpSuccess)
						})
					} else {
						return res.status(401).send(message.accountExisted)
					}

				})
		})
};