const url = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSf0r03S6TFdWsQsHf6HPYdanbTkaRQ2Mt_h4fsHjcqrNzhqlw/formResponse";
const user = 'entry.2132131866';
const obra = 'entry.1693883818';
const rank = 'entry.437166774';

$().ready(function(){
	
	
	
});


function vot(text, val) {
	var newForm = jQuery('<form>', {
        'action': url,
        'target': '_top'
    }).append(jQuery('<input>', {
        'name': user,
        'value': 'test-user',
        'type': 'hidden'
    })).append(jQuery('<input>', {
        'name': obra,
        'value': text,
        'type': 'hidden'
    })).append(jQuery('<input>', {
        'name': rank,
        'value': val,
        'type': 'hidden'
    }));
	
	$("body").append(newForm);
    newForm.submit();
	
    $("body form").remove();
}

function postData(text, val) {
	var form = new FormData();
	form.append("entry.2132131866", "usuari1");
	form.append("entry.1693883818", "La pell freda");
	form.append("entry.437166774", "4");

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://docs.google.com/forms/u/0/d/e/1FAIpQLSf0r03S6TFdWsQsHf6HPYdanbTkaRQ2Mt_h4fsHjcqrNzhqlw/formResponse",
	  "method": "POST",
	  "headers": {
	    "cache-control": "no-cache",
	    "Postman-Token": "e65af156-557a-400c-871c-9ca0108eb790",
	  },
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data",
	  "data": form
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	});
}