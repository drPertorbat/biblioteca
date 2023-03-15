const url = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSf0r03S6TFdWsQsHf6HPYdanbTkaRQ2Mt_h4fsHjcqrNzhqlw/formResponse";
const user = 'entry.2132131866';
const obra = 'entry.1693883818';
const rank = 'entry.437166774';

var userCode;

$().ready(function(){
	
	userCode = localStorage.getItem("ruser");
	
	if(!userCode){
		userCode = makeid(5);
		localStorage.setItem('ruser', userCode);		
	}
	
	
	$('.rank span').click(function(){
		var val = $(this).text();
		var text = $(this).parent().data("target");
		
		testVot(text, val);
	});
	
	
	
});

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}



function testVot(text, val) {
	
	var newForm = jQuery('<form>', {
        'action': url,
        'target': '_top'
    }).append(jQuery('<input>', {
        'name': user,
        'value': userCode,
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
	

    $.ajax({
        type: 'POST',
        url: url,
        crossdomain: false,
        dataType: 'json',
        data: newForm.serialize(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        statusCode: { //the status code from the POST request
            0: function(data) { //0 is when Google gives a CORS error, don't worry it went through
              //success
              console.log('hooray!');
            }, 
            200: function(data) {//200 is a success code. it went through!
              //success
            	console.log('hooray!');
            },
            403: function(data) {//403 is when something went wrong and the submission didn't go through
              //error
            	console.log('Oh no! something went wrong. we should check our code to make sure everything matches with Google');
            }
          }  
    });

    return false;
}

