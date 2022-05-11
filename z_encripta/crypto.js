

$().ready(function () {

	console.log("started");
	console.log(jsonData);
	text = load(0);
	init();

});


function cypher(text, cypher) {
	
	
	console.log(cypher);
	var scramble = "";
	for(var i = 0; i< text.length; i++){
		var letter = text.toLowerCase()[i];
		if(letter.toUpperCase() != letter.toLowerCase()){
			var pos = text.charCodeAt(i);
			pos = pos - 65;
			letter = cypher[pos];
		}
		scramble += letter;
	}

	return scramble;
}

function generateCypher() {
	var cypher = "";
	var alphat = "abcdefghijklmnopqrstuvwxyz";

	while(alphat.length > 0){
		var pos = getRandomInt(0, alphat.length); 
		cypher += alphat.charAt(pos);
		alphat = alphat.slice(0, pos) + alphat.slice(pos+1);

		console.log(cypher);
		console.log(alphat);
	}

	return cypher;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function init(){
	var key = generateCypher();
	text = cypher(text.toUpperCase(), key);

	var full_text = [];
	var line = "";
	var w = window.innerWidth;
	var max_char = 25;
	if( w *0.8/40 < 25) {
		max_char = Math.trunc(w *0.8/40);
	}

	var text_line = text.split(" ");

	for(var i = 0; i < text_line.length; i++) {
		var word = text_line[i];
		if(line.length + word.length + 1 > max_char) {
	  		full_text.push(line);
	    	line = "";
	  	}
	 
	  	for(var j=0; j< word.length; j++){
	  		line += word[j];
	  	}
	  	line += " ";
	 
	}
	full_text.push(line);
	console.log(full_text);


	for(var l=0; l<full_text.length; l++) {
		text = full_text[l];
		var $htmlLine = $('<div class="line"></div>');
		for (var i = 0; i<text.length; i++) {
			var letter = text[i];
			
			if(letter.toUpperCase() != letter.toLowerCase()){
				$htmlLine.append('<div><input class=" letter letter_' + text[i] + '" value="" maxlength="1" data-letter="' + text[i] + '"/><br>' + text[i] + '</div>');	
			} else {
				//si no es lletra
				$htmlLine.append('<div><input class="no-letter" value="' + text[i] + '" readonly /><br> </div>');
			}
			
		}
		$('#message').append($htmlLine);
	}

	

	$( ".letter" ).click(function() {
	  $('input').removeClass("selected");
	  console.log($(this))
	  if($(this).hasClass('letter')){
	  	var letter = $(this).data("letter");
	  	$('.letter_' + letter).addClass("selected");
	  }

	});

	$( ".letter" ).keyup(function() {
	  
	  console.log("blur " + $(this).val());
	  if($(this).hasClass('letter')){
	  	var letter = $(this).data("letter");
	  	$('.letter_' + letter).val($(this).val());
	  }

	});
}

function load(id) {
	var str = jsonData[id].text;
	str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	console.log(str);
	return str;
	// $.getJSON("text.json", function(json) {
	//     console.log(json); // this will show the info it in firebug console
	//     text = json.text;

	//     init();
	// });
}