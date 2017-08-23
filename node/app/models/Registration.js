import mongoose from 'mongoose'

const RegistrationSchema = new mongoose.Schema({
	"delegate": {
		"title": {
			type: String,
		},
		"firstName": String,
		"lastName": String,
		"country": String,
		"gender": String,
		"position": String,
		"organization": String,
		"address": String,
		"email": {
			type: String,
			required: true,
			unique: true
		},
		"password": {
			type: String,
			required: true
		},
		"fax": String,
		"phone": String,
		"mobile": String,
		"dateOfBirth": String,
		"meals": {
			type: String,
			default: 'non-vegetarian'
		}
	},
	"flight": {
		"arrival": {
			"airline": String,
			"flight": String,
			"date": String,
			"time": String
		},
		"departure": {
			"airline": String,
			"flight": String,
			"date": String,
			"time": String
		}
	},
	"accom": {
		"hotel": {
			type: String,
			default: 'Fresh Fields Hotel'
		},
		"stay": String,
		"checkIn": Date,
		"checkOut": Date
	},
	"tour": {
		"tour": String
	},
	"paper": {
		"role": {
			type: String,
			default: 'General'
		},
		"session": {
			type: String,
			default: 'Topic 1 | Sustainable water use and ecologically sustainable development'
		},
		"type": {
			type: String,
			default: 'Oral Presentation'
		},
		"title": String,
		"authors": [{
			name: String,
			affiliation: String
		}],
		"affiliations": [String],
		"abstract": String,
		"keywords": [String],
		"link": String
	},
	"created_at": Date,
	"updated_at": Date
}, { collection: 'Registration' })

// RegistrationSchema.methods.getContent = () => this.content


RegistrationSchema.pre('save', function(next) {
	// get the current date
	var currentDate = new Date();
	// change the updated_at field to current date
	this.updated_at = currentDate;
	// if created_at doesn't exist, add to that field
	if (!this.created_at)
		this.created_at = currentDate;
	next();
});

// RegistrationSchema.post('save', function(error, doc, next) {
// 	if (error.name === 'MongoError' && error.code === 11000) {
// 		next(new Error('There was a duplicate key error'));
// 	} else {
// 		next(error);
// 	}
// });

module.exports = mongoose.model('Registration', RegistrationSchema);
