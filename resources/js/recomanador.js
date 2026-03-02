var tematica, temps, epoca, zona;
var cat;
var candidats;
$().ready(function(){
	
	cat = "0";
	
	$('#startBtn').click(function(){
		start();
	});
	
	if($('#poll0').length){
		$('#poll0 .btn').click(function(){
			$('#poll0').hide();
			$('#poll1').show();
			
			cat = $(this).val();
			console.log(cat);
		});
	}
		
	$('#poll1 .btn').click(function(){
		$('#poll1').hide();
		$('#poll2').show();
		
		tematica = $(this).val();
		console.log(tematica);
	});
	
	$('#poll2 .btn').click(function(){
		$('#poll2').hide();
		$('#poll3').show();
		
		temps = $(this).val();
		console.log(temps);
	});
	
	$('#poll3 .btn').click(function(){
		$('#poll3').hide();
		$('#poll4').show();
		
		epoca = $(this).val();
		console.log(epoca);
	});
	
	$('#poll4 .btn').click(function(){
		$('#poll').hide();		
		$('#result').show();
		
		zona = $(this).val();
		console.log(zona);
		
		search();
	});
	
	$('.restart').click(function() {
		tematica = "";
		temps = "";
		epoca = "";
		zona = "";
		
		$('#result').hide();
		$('#no-result').hide();
		start();
	});
	
	$('#more').click(function() {
		if(!$(this).hasClass("disabled")) {
			$('#calulating').show();
			$('#carouselExampleCaptions').hide();
			prepareBooks(candidats);
		}
	});
});

function start() {
	$('#poll4').hide();
	if($('#poll0').length){			
		$('#poll0').show();		
	} else {
		$('#poll1').show();			
	}
	$('#startDiv').hide();
	$('#poll').show();
}
		

function search() {
	candidats = list.filter(filter);
	console.log(candidats);
	prepareBooks(candidats);
	
}

function showResult(){
	
	$('#calulating').hide();
	$('#carouselExampleCaptions').show();	
}

function filter(el) {
	//cat - no sempre
	//tematica, 
	//temps, 
	//epoca, 
	//zona;
	
	if(cat != "0" && !el.cat.includes(cat))
		return false;

	if(epoca != "0" && el.epoca != epoca){
		return false;
	}
	
	if(zona != "0" && el.origen != zona){
		return false;
	}
	
	if(tematica != "0" && !el.tema.includes(tematica)) {
		return false;
	}
	
	if(temps != "0" && !el.mida.includes(temps)){
		return false;
	}
	
	return true;
	
}

function prepareBooks(candidates){
	
	

	$('#carouselExampleCaptions .carousel-inner').html("");
	if(candidates.length > 0) {
		prepareBook(getRandomCandidate(candidates,true), true);
		if(candidates.length > 0) {
			prepareBook(getRandomCandidate(candidates, true), false);
			if(candidates.length > 0) {
				prepareBook(getRandomCandidate(candidates, false), false);
			}
		}
		if(candidates.length > 0) {
			$('#more').removeClass("disabled");
		} else {
			$('#more').addClass("disabled");
		}
		showResult();
	} else {
		$('#calulating').hide();
		$('#carouselExampleCaptions').hide();	
		$('#no-result').show();
	}
	
	
	

}

function getRandomCandidate(candidates, top) {
	var max = candidates.length;
	if(top) {
		max = candidats.map(c => c.tier).indexOf(2); //trobem tots els tier1
		if(max < 3){
			max = candidats.map(c => c.tier).indexOf(3); //incloure tier2
		}
		if(max < 0) {
			max = candidates.length;
		}
	}
	var random = getRandomInt(max);
	console.log(random);
	return candidats.splice(random,1)[0];
}

function prepareBook(candidate, active) {
	carouselItem ='' 
		+  '<div class="carousel-item '+ (active ? 'active' : '') + '">'
		+		'<div class="car-portada" style="background-image: url(\'' + candidate.imgUrl + '\');"></div>'
		+		'<div class="carousel-caption">'
		+			'<h5>' + candidate.nom + '</h5>'
		+			'<h5>' + candidate.autor + '</h5>'
		+			'<p>' + candidate.editorial + '</p>'
		+			'<a href="' + candidate.link + '" target="_blank">Veure fitxa</a>'
		+		'</div></div>';
		
	
	
	$('#carouselExampleCaptions .carousel-inner').append(carouselItem);
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}