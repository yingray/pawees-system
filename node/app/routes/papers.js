// import PaperInfo from '../models/PaperInfo'

module.exports = function(router) {
	'use strict';
	router.route('/')
		.get(function(req, res, next) {
			// Logic for GET /users routes
			// PaperInfo.find({}, (error, papers) => {
			// 	if (error) return next()
			// 	return res.json(papers)
			// })
			next()
		})
		.post(function(req, res, next) {
			// Create new user
			// const { email, title, authors, affiliations, abstract, keywords } = req.body
			// const filename = `${authors[0]} - ${title}`
            //
			// PaperInfo.findOneAndUpdate({
			// 	"email": email,
			// 	"title": title
			// }, {
			// 	"email": email,
			// 	"title": title,
			// 	"authors": authors,
			// 	"affiliations": affiliations,
			// 	"abstract": abstract,
			// 	"keywords": keywords,
			// 	"link": `https://pawees.tk/papers/${filename}.pdf`
			// }, { upsert: true }, function(err, papers) {
			// 	if (err) throw err;
			// 	// we have the updated user returned to us
			// 	const Con = require('../../lib/convertPdf')
			// 	Con(filename, req.body)
			// 		.then(() => res.send(`https://pawees.tk/papers/${filename}.pdf`))
			// 		.catch(error => {
			// 			console.log(error)
			// 			res.send(error)
			// 		});
			// });
			next()
		});
};