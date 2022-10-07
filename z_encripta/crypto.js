const setTheme = theme => document.documentElement.className = theme;

$().ready(function () {
	
	$('.theme-button').click(function(){
		setTheme($(this).data("theme"));		
	});

	console.log("started");
	var textId = 0;
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if(urlParams.has('text')){
		textId = urlParams.get('text')
		textId = parseInt(textId) || 0;
	}
	
	console.log(jsonData);
	json = load(textId);
	
	init(json);

});


function cypher(text, cypher) {
	
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
	}

	return cypher;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function textToLines(text, max_char, full_text) {
	var text_line = text.split(" ");
	var line = "";
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
}

function init(json){
	var text = normalizeText(json.text);
	var title = normalizeText(json.title + " - " + json.author);
	var key = generateCypher();
	text = cypher(text.toUpperCase(), key);
	title = cypher(title.toUpperCase(), key);
	
	var full_text = [];
	var line = "";
	var w = window.innerWidth;
	var max_char = 25;
	if( w/40 < 25) {
		max_char = Math.trunc(w *0.8/40);
	}

//	var text_line = text.split(" ");
//
//	for(var i = 0; i < text_line.length; i++) {
//		var word = text_line[i];
//		if(line.length + word.length + 1 > max_char) {
//	  		full_text.push(line);
//	    	line = "";
//	  	}
//	 
//	  	for(var j=0; j< word.length; j++){
//	  		line += word[j];
//	  	}
//	  	line += " ";
//	 
//	}
//	full_text.push(line);
	textToLines(text, max_char, full_text);
	textToLines(title, max_char, full_text);
	
	


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
	  if($(this).hasClass('letter')){
	  	var letter = $(this).data("letter");
	  	$('.letter_' + letter).val($(this).val());
	  }

	});
}


function normalizeText(text) {
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function load(id) {
	
	if(jsonData.length <= id){
		id = 0;
	}
	return jsonData[id];
}