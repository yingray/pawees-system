/* 1. Login Form Handle */
$('.login[data-log="login"] .button').click(function() {
	const submitFormObject = {
		"email": $('.login[data-log="login"] input[name="email"]').val(),
		"password": md5($('.login[data-log="login"] input[name="password"]').val())
	}
	apis.Login(submitFormObject);
})

$('.login[data-log="signup"] .button').click(function() {
	const submitFormObject = {
		"email": $('.login[data-log="signup"] input[name="email"]').val(),
		"password": md5($('.login[data-log="signup"] input[name="password"]').val())
	}
	const validEmail = submitFormObject.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
	const validPassword = $('.login[data-log="signup"] input[name="password"]').val().match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

	if (validEmail && validPassword) {
		apis.SignUp(submitFormObject);
	} else if (!validEmail) {
		alert('Not a valid email address. Please try again.');
	} else if (!validPassword) {
		alert('Password need to be at least 8 characters and include 1 letter and 1 number.');
	} else {
		alert('error');
	}
})

$('.login[data-log="logout"] .button').click(function() {
	apis.Logout();
})


/* 2. Serialize Object for Form to Json */
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			if (this.value.trim()) {
				o[this.name].push(this.value.trim() || '');
			}
		} else {
			o[this.name] = this.value.trim() || '';
		}
	});
	return o;
};

function changeAuthorsFormat(submitFormObject) {
	if(submitFormObject['paper'].hasOwnProperty('authors')) {
		var newAuthors = []
		if(typeof submitFormObject.paper.authors === 'object') {
			$.each(submitFormObject.paper.authors, function(key, value) {
				if(isEven(key)) {
					newAuthors[Math.floor(key/2)] = {
						name: value,
						affiliation: ''
					};
				} else {
					newAuthors[Math.floor(key/2)].affiliation = value;
				}
			})
		}
		console.log(newAuthors);
		submitFormObject.paper.authors = newAuthors;
	}
	return submitFormObject;
}

/* 3. Multi-input Component */
var txtId = 1;

function appendInputField(element, value) {
	var value = value ? value : '';
	var vn = value.name ? value.name : '';
	var name = $(element).attr('name');
	var nameId = name.concat(txtId);
	var inputField = '<input type="text" name="' + name + '"value="' + value + '">';
	if (name === 'affiliations') {
		inputField = '<input type="text" name="' + name + '"value="' + value + '" style="width: 400px;" onchange="updateAuthorsAff()">';
	} else if (name === 'authors') {
		inputField = '<input type="text" name="authors" value="' + vn + '">\
		<select name="authors" value="' + value.affiliation + '" style="width:200px;" required>\
		<option value="" selected disabled>Please select</option>\
			</select>\
		';
	}
	var buttonMinor = '<input type="button" value="-" onclick="deltxt(' + nameId + ');updateAuthorsAff();">'
	$(element).before('<li id="' + nameId + '">' + inputField + buttonMinor + '</li>')
	txtId++;
	updateAuthorsAff();
}

function updateAuthorsAff() {
	var select = $('select[name="authors"]');
	var aff_field = $('input[name="affiliations"][type="text"]');
	select.html('');
	if(aff_field.length === 0) {
		select.append('<option value="" selected disabled>Please fill out affiliations field</option>');
	}
	$.each(aff_field, (k, v) => {
		if(v.value) select.append('<option>'+v.value+'</option>');
	});
}

$('input[data-type="array"]').click(function() {
	appendInputField(this);
});

function deltxt(nameId) {
	$(nameId).remove();
}

/* 4. Auto-fill out data in Forms */
var form_config = ['delegate', 'accom', 'tour', 'flight', 'paper'];

function autofillAllForm(obj) {
	$('form').map((i, f) =>
		$(f).find('input, select, textarea').map((a, b) => {
			if (i === 2) $(b).val(obj[0].delegate[b.name])
			if (i === 3 && obj[0].accom[b.name]) {
				if (b.name === 'checkIn' || b.name === 'checkOut') {
					$(b).val(obj[0].accom[b.name].slice(0, 10))
				} else {
					$(b).val(obj[0].accom[b.name])
				}

			}
			if (i === 4) $(b).val(obj[0].tour[b.name])
			if (i === 5) $(b).val(obj[0].flight[$(b).attr('flight')][b.name])
			if (i === 6) {
				if(obj[0].paper[b.name]) {
					if ($(b).attr('data-type')) {
						if(b.name === 'authors') {
							obj[0].paper['authors'].map(obj => {
								appendInputField(b, obj);
							})
						} else {
							obj[0].paper[b.name].map(string => {
								appendInputField(b, string);
							})
						}
					} else {
						$(b).val(obj[0].paper[b.name])
					}
				}
			}
		}))
	updateRevision(obj);
	updateAuthorsAff();
}

function updateRevision(obj) {
	if (obj[0].paper['link'] && obj[0].paper['authors']) {
		$('.abstract fieldset p.revision').html('\
		<br>\
		' + obj[0]['updated_at'].slice(0, 10) + ' Revision ｜ <i class="fa fa-file-pdf-o" aria-hidden="true"></i>\
		<a href="' + obj[0].paper['link'] + '" target="_blank">\
			' + obj[0].paper['authors'][0].name + ' - ' + obj[0].paper['title'] + '\
		</a>\
		<br>\
		<br>\
		<h1>Edit</h1>\
		');

		$('form.account fieldset p.revision').html('\
			Your registration information and abstract submission have been updated at ' + obj[0]['updated_at'].slice(0, 10) + '.<br>\
			If you want to revise new information,\
			please click "Revise Information" button in the lower right corner and follow the steps to edit the data again.<br>\
			Abstract｜ <i class="fa fa-file-pdf-o" aria-hidden="true"></i>\
				<a href="' + obj[0].paper['link'] + '" target="_blank">\
				' + obj[0].paper['authors'][0].name + ' - ' + obj[0].paper['title'] + '\
				</a>\
		');
	}

}

/* 5. Registration Submitting */
$('.submit_info').click(function() {

	var form = $("form");
	var submitFormObject = {}

	form.each(function(index) {
		if (index > 1) {
			var form_index = index - 2;
			var form_name = form_config[form_index];
			submitFormObject[form_name] = $(this).serializeObject()
		}
	});

	submitFormObject = changeAuthorsFormat(submitFormObject);

	confirm("Are you sure you want to submit this form?", function(result) {
		if (result) {
			apis.UpdateProfile(submitFormObject);
		}
	});


});

/* 6. Login Status */
function ChangeToLogin(data) {

	$('.Registration_Page').find('form').removeClass('write_form');

	$('.Registration_Page').find('form:nth-child(1)').addClass('write_done');

	$('.Registration_Page').find('form:nth-child(2) .next_step').trigger('click');
	$('.Registration_Page').find('form:nth-child(2) input[name="email"]').val(data[0].delegate.email);

	$('.Registration_Page').find('form:nth-child(3)').addClass('write_form');
}

function returnToMemberAccount() {
	Registration_form.removeClass('write_form');
	Registration_form.removeClass('write_done');
	fixed_shadowbg_li.removeClass('write_done');
	fixed_shadowbg_li.removeClass('write');
	Registration_form.eq(1).addClass('write_form');
	fixed_shadowbg_li.eq(0).addClass('write');
}

/* 7. Loading Start */
var loadingStatus = 0;

if (loadingStatus <= 0) {
	LoadingEnd()
} else {
	LoadingStart()
}

function isEven(n) {
	return n % 2 == 0;
}

function LoadingStart() {
	$('.fixed_shadow[data-loading="pawees"]').addClass('fixed_shadow2');
}

function LoadingEnd() {
	$('.fixed_shadow[data-loading="pawees"]').removeClass('fixed_shadow2');
}
//
// $('body').click(function() {
// 	//testing
// 	var form = $("form");
// 	var submitFormObject = {}
//
// 	form.each(function(index) {
// 		if (index > 1) {
// 			var form_index = index - 2;
// 			var form_name = form_config[form_index];
// 			submitFormObject[form_name] = $(this).serializeObject()
// 		}
// 	})
// })