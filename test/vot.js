var currentId, nextId, rating;

$().ready(function(){
	nextBook();	
	$("#next").click(nextBook);
	
	$('.my-star').mouseenter(rate);
	$('.my-star').mouseover(rate);
	$('.my-star').click(function(){
		vota(rating);
//		displayNext();		
//		prepareNext();
		nextBook();
	});
	
//	$('.my-star').touchstart(rate);
//	$('.my-star').touchend(function(){
//		vota(rating);
//		nextBook();
//	});
});


function nextBook() {
	$('.my-star').removeClass("is-active");
	rating = 0;
	
	displayNext();
	
	prepareNext();
	
	
}

function displayNext() {
	$('.current').addClass("prenext");
	$('.next').addClass("current");
	$('.next').removeClass("next");
	$('.prenext').removeClass("current");
	$('.prenext').addClass("next");
	$('.prenext').removeClass("prenext");
	
	currentId = nextId;
	
	
	
}

function prepareNext() {
	nextId = getRandomInt(list.length);
	var book = list[nextId];
	
	$(".next #li-title b").html(book.title);
	$(".next #li-author b").html(book.author);
	$(".next #li-publisher").html(book.publisher + "(" + book.year + ")");
	$(".next #image img").attr("src", book.imageUrl);
	
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}



function vota(val) {
	var book = list[currentId];
	
	// Get data
	var data = {
	  'entry.2132131866': "usuari1",
	  'entry.1545437935': book.id,
	  'entry.1693883818': book.title,
	  'entry.766523435':  book.author,
	  'entry.437166774': val
	};

	  // Send request
	$.ajax({
		url: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSew_yqymFS3FUjyE7fyp_mjul46wV-GscaQdeVR3G2d7Dki9Q/formResponse',
		type: 'POST',
		crossDomain: true,
		dataType: "xml",
		data: data,
		success: function(jqXHR, textStatus, errorThrown) {
			console.log('Enter on success');
			$('#feedback').html('<label class="text-success">Message sent!</label>');
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Enter on error');
			$('#feedback').html('<label class="text-success">Message sent!</label>');
	    }
	});
    
}

function rate(){

	rating = $(this).data("star");
	$('.my-star').each(function(i, e){
		if(i<rating) {
			$(e).addClass("is-active");
		} else {
			$(e).removeClass("is-active");
		}
	});
}

/**
entry.2132131866: usuari
entry.1545437935: id
entry.1693883818: obra
entry.766523435: autor
entry.437166774: val
*/