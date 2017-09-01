const requestBodyToModelBody = (requestBody, filename) => {
	const response = {
		"updated_at": new Date(),
		"delegate": {
			"title": requestBody.delegate.title,
			"firstName": requestBody.delegate.firstName,
			"lastName": requestBody.delegate.lastName,
			"country": requestBody.delegate.country,
			"gender": requestBody.delegate.gender,
			"position": requestBody.delegate.position,
			"organization": requestBody.delegate.organization,
			"address": requestBody.delegate.address,
			"email": requestBody.delegate.email,
			"password": requestBody.delegate.password,
			"fax": requestBody.delegate.fax,
			"phone": requestBody.delegate.phone,
			"mobile": requestBody.delegate.mobile,
			"dateOfBirth": requestBody.delegate.dateOfBirth,
			"session": requestBody.delegate.session,
			"type": requestBody.delegate.type,
			"meals": requestBody.delegate.meals,
			"tour": requestBody.delegate.tour
		},
		"flight": {
			"arrival": {
				"airline": requestBody.flight.airline[0],
				"flight": requestBody.flight.flight[0],
				"date": requestBody.flight.date[0],
				"time": requestBody.flight.time[0]
			},
			"departure": {
				"airline": requestBody.flight.airline[1],
				"flight": requestBody.flight.flight[1],
				"date": requestBody.flight.date[1],
				"time": requestBody.flight.time[1]
			}
		},
		"accom": {
			"hotel": requestBody.accom.hotel,
			"stay": requestBody.accom.stay,
			"checkIn": requestBody.accom.checkIn,
			"checkOut": requestBody.accom.checkOut
		},
		"tour": {
			"tour": requestBody.tour.tour
		},
		"paper": {
			"session": requestBody.paper.session,
			"type": requestBody.paper.type,
			"role": requestBody.paper.role,
			"title": requestBody.paper.title,
			"authors": requestBody.paper.authors,
			"affiliations": requestBody.paper.affiliations,
			"abstract": requestBody.paper.abstract,
      "keywords": requestBody.paper.keywords,
      "link": filename ? `/papers/${filename}.pdf` : ''
		}
	}

	return response
}

export const firstAuthor = authors => {
	let fa = '';
    if (authors) {
        fa = typeof authors === 'string' ? authors : authors[0].name
    }
    return fa
}

export default requestBodyToModelBody
