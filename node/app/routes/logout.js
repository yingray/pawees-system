module.exports = function(router) {
    'use strict';
	router.route('/')
		.post((req, res, next) => {
			/*
			 Mar 27: Log out API
			 */
			req.session.destroy();
			return res.send('User has logged out!');
		})
}