const setTheme = theme => document.documentElement.className = theme;
const solution = {};
var storage = true;
var special = false;
var currentJsonId, selectedJsonId, selectedExtra; //per guardar quin especial està seleccionat


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

	$('#conf-button').click(function(){
		if(storage){
			let showTitle = localStorage.getItem("showTitle", false);
			if(showTitle === "false"){
				localStorage.setItem("showTitle", "true");
			} else {
				localStorage.setItem("showTitle", "false");
			}
			encriptat.changeShowTitle();
		}
	});
	
	$('#back-button').click(function(){
		$('.extra-list').show();
		$('.item-list').hide();
	});

	$('#share-button').click(function(){
		if(false){
			//no es pot executar es de l'iframe de itch.io
			navigator.share({
				title: 'Juaga a Encriptat',
				text: 'Ja has resolt l\'encriptat de la setmana? Jo sí!',
				url: 'https://rucselectrics.itch.io/encriptat'
			  }).then(() => {
				console.log('Gràcies per compartir!');
			  })
			  .catch(console.error);
		} else {
			var text = '';
			if (special){
				var e = extra.find(x => x.id === currentJsonId);				
				text = '#Encriptat especial resolt. ' + e.title + ' ' + selectedExtra + '\n\nhttps://rucselectrics.itch.io/encriptat';
			} else {
				text = '#Encriptat resolt. Setmana ' + weekNumber() + '\n\nhttps://rucselectrics.itch.io/encriptat';
			}
			navigator.clipboard.writeText(text).then(
				function(){
					showToast("Text copiat al porta-retalls :)"); 
				})
			  .catch(
				 function(e) {
					showToast("No s'ha pogut copiar el text :(");
					console.error(e);
			  	});
		}
	});

	$('#backToNormalBanner').click(function(){
		document.location.href = document.location.href;
	});

	$('#extra-button').click(function(){
		//obrir modal extra
		$('.extra-list').show();
		$('.item-list').hide();
		$('#extra-modal').show();
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

	//generar llista extras
	extra.forEach(e => {
		$('#extra-modal ul#extra-list').append("<li class='extra-item' data-target='"+ e.id + "'>" + e.title + "</li>");	
	});
	$('.extra-item').click(function(){
		currentJsonId = $(this).data("target");
		var e = extra.find(x => x.id === currentJsonId);

		$('.item-list h4').text(e.title);
		$('.item-list p.description').text(e.desc);
		
		loadFile(e.url, function(data){
			var decodedData = LZString.decompressFromEncodedURIComponent(data);
			decodedData = decodedData.replaceAll("’", "'");
			displayList(JSON.parse(decodedData));
		});
		
	});

	$('.footer .banner').click(function(){
		window.open("https://drpertorbat.github.io/biblioteca/millor-fantastic/votacions.html", "_blank");
	})

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
				if(storage && special) {
					addExtraSolved(selectedJsonId, selectedExtra);
				}
				//if special && storage --> save special solved
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

function loadFile(url, f) {
	$.ajax({
		url: url,
	})
	.done(f);
}

function displayList(currentJson) {
	$('#extra-modal ul#item-list').html("");
	var map = getMapExtraSolved();
	currentJson.forEach(function(e,i){
		var solved = false;
		if(map[currentJsonId]) {
			if(map[currentJsonId].indexOf(i) != -1) {
				solved = true;
			}
		}
		var solvedClass = solved ? "solved": ""
		$('#extra-modal ul#item-list').append("<li class='extra-encriptat " + solvedClass + "' data-target='" +  i + "' >" + i + "</li>");	
	});

	$('.extra-encriptat').click(function(){
		selectedExtra = $(this).data("target");
		selectedJsonId = currentJsonId;		
		loadExtraEncriptat(currentJson[selectedExtra]);
	});

	$('.extra-list').hide();
	$('.item-list').show();
	
}

function loadExtraEncriptat(e) {
	$("#message").html("");
	ep = new Encriptat(false);
	ep.setShowTitle(false);
	ep.fromJson(e);
	ep.display();
	binds(ep);
	special = true;
	$('#extra-modal').hide();
	
	$("#countDownBanner").hide();
	$("#backToNormalBanner").show();


	$('#reset-button').unbind("click").click(function(){
		ep.cleanSolution();
		$( ".letter" ).val("");	
	});
}

function getExtraSolved(id){
	var map = getMapExtraSolved();
	var list = map[id];
	if(!list) {
		list = [];
	}
	return list;
}

function getMapExtraSolved() {
	var mapSolved = localStorage.getItem("mapSolved");
	if(!mapSolved){
		return {};
	} else {
		return JSON.parse(mapSolved);
	}
}

function addExtraSolved(jsonId, extraId) {
	var map = getMapExtraSolved();
	var list = getExtraSolved(jsonId);
	if(list.indexOf(extraId) == -1)
		list.push(extraId);
	map[jsonId] = list;
	localStorage.mapSolved = JSON.stringify(map);
}

function weekNumber() {
	currentDate = new Date();
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
         
    return Math.ceil(days / 7);
}

async function showToast(message){
	$('.toast-body').html(message);
	$('.toast').addClass("visible");

	await new Promise(resolve => setTimeout(resolve, 2000));
	$('.toast').removeClass("visible");
}

