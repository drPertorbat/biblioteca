const setTheme = theme => document.documentElement.className = theme;
const solution = {};
var storage = true;

$().ready(function () {
	
	try{
		var theme = localStorage.theme;
		if(theme){
			setTheme(theme);
		}
	}catch(error){
		storage = false;
		$('#alert1').show();
	}

	$('.theme-button').click(function(){
		setTheme($(this).data("theme"));
		if(storage){
			localStorage.setItem("theme", $(this).data("theme"));		
		}
	});

	$('#help-button').click(function(){
		$('#dialog-help').show();
	});
	

	$('#share-button').click(function(){
		if(navigator.share){
			navigator.share({
				title: 'Juaga a Encriptat',
				text: 'Ja has resolt l\'encriptat de la setmana?',
				url: 'https://rucselectrics.itch.io/encriptat'
			  }).then(() => {
				console.log('Thanks for sharing!');
			  })
			  .catch(console.error);
		} else {
			console.log("no share available")
			var text = 'Ja has resolt l\'encriptat de la setmana?\n\nhttps://rucselectrics.itch.io/encriptat';
			navigator.clipboard.writeText(text).then(
				function(){
					alert("Copied successfully"); 
				})
			  .catch(
				 function() {
					alert("Error"); 
			  });
		}
	});

	var encriptat = new Encriptat(storage);
	$('#reset-button').click(function(){
		encriptat.cleanSolution();
		$( ".letter" ).val("");	
	});
	
	//validar si hi ha partida guardada;
	if(!encriptat.loadGame()){
		loadFileEncriptat(encriptat);
	} else {		
		binds(encriptat);
		showCountDown(encriptat);
	}


	$('.modal .close').click(function(){
		$('.modal').hide();
	});

});

function showCountDown(encriptat) {
	let daysLeft = encriptat.getTimeLeft();
	if(daysLeft == 1) {
		$('#countDownBanner').html("Et queda 1 dia");	
	} else {
		$('#countDownBanner').html("Et queden " + daysLeft + " dies");	
	}


	
}


function binds(encriptat) {
	$( ".letter" ).click(function() {
		$('input').removeClass("selected");

		if($(this).hasClass('letter')){
			var letter = $(this).data("letter");
			$('.letter_' + letter).addClass("selected");			
		}
		this.selectionStart = this.selectionEnd = this.value.length;

	});

	$( ".letter" ).keyup(function() {	  
		if($(this).hasClass('letter')){
			var letter = $(this).data("letter");
			$('.letter_' + letter).val($(this).val());
			encriptat.addLetter(letter, $(this).val());
			encriptat.checkConflicts();
			if(encriptat.validateSolution()){
				encriptat.showDialogWin();				
			}
		}
	});
}

function load(jsonData) {
	//TODO ha de recuperar el del dia
	var selected;
	var today = new Date();
	today.setHours(0,0,0,0);
	jsonData.forEach((item) =>{
		var dateFrom = new Date(item.dateFrom);
		dateFrom.setHours(0,0,0,0);
		var dateTo = new Date(item.dateTo);
		dateTo.setHours(0,0,0,0);
		if(dateFrom <= today && dateTo >= today ){
			selected = item;			
		}
	});
	if(!selected){
		selected = jsonData[0];
	}
	return selected;
}

function loadFileEncriptat(encriptat) {
	$.ajax({
		url: "https://drpertorbat.github.io/biblioteca/z_encripta/raw.txt",
	})
	.done(function( data ) {
		
		string = LZString.decompressFromEncodedURIComponent(data);
		string = string.replaceAll("’", "'");
		var jsonData = JSON.parse(string);		
		var json= load(jsonData);
		encriptat.fromJson(json);
		encriptat.display();
		binds(encriptat);
		showCountDown(encriptat);
	});
}
