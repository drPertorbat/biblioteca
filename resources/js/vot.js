var currentId, nextId, rating;
var storage = true;
var voted = [];
var currentBook;

var nc=0, nt=0, pc=0, pt=0, r=0;

$().ready(function(){
	
	try{
		user = localStorage.user;
		listVoted = localStorage.voted;
		if(listVoted) {
			voted = listVoted.split(",");
			removeVoted();			
		}
		
		if(!user) {
			user = makeid(6);
			localStorage.setItem("user", user);
		}
			
	}catch(error){
		storage = false;
		//$('#alert1').show();
	}
	
	prepareNext();
	
	$('#startBtn').click(function(){
		nextBook();
		$('#startDiv').hide();
		$('#puntTop').show();
	});
		
	$("#next").click(function(){
		removeBookById(currentId);
		nextBook();
	});
	
	$('#voteStar').click(function() {
		
		vota(rating);
		nextBook();
		
	});
	
	$('#voteSlide').click(function() {
		
		rating = $('#myRange').val();
		
		
		vota(rating);
		nextBook();
		
	});
	
	if($('#myRange')){
		$('#myRange').on('input', function () {
			$('#rangeVal').text($(this).val());
		});
	}
	
	
//	$('.my-star').mouseenter(rate);
//	$('.my-star').mouseover(rate);
//	$('.my-star').click(function(){
//		rate();
////		displayNext();		
////		prepareNext();
//		nextBook();
//	});
	
//	$('.my-star').touchstart(rate);
	$('.my-star').click(function() {
		rate($(this));
		$('#rangeVal').text(rating);
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

function removeBookById(id){
	var found = list.find(b => b.id == id);
	var index = list.indexOf(found);
		if(index > -1){
		return list.splice(index,1)[0];		
	}
}

function removeVoted() {
	for(var i=0; i<voted.length; i++){
		var id = parseInt(voted[i]);
		if(id != NaN){
			removeBookById(id)
		}
	}
}


function nextBook() {
//	$('.my-star').removeClass("is-active");
//	rating = 0;
	
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
	currentBook = removeBookById(currentId);
	
	statistics(currentBook);
}

function prepareNext() {
	if(list.length > 0) {
		var index = getRandomInt(list.length);
		
		var book = list[index];
		nextId = book.id;
				
		$(".next #li-title b").html(book.title);
		$(".next #li-author b").html(book.author);
		$(".next #li-publisher").html(book.publisher + "(" + book.year + ")");
		$(".next #image img").attr("src", book.imageUrl);

	}
	
}

function getRandomInt(max) {
	//return 1;
//	return Math.floor(Math.random() * max);

	return Math.floor(Math.floor(Math.random() * max) / (Math.floor(Math.random() * 3)+1))
}

function vota(val) {
	var book = currentBook;
	
	
	// Get data
	var data = {
	  'entry.2132131866': user,
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
			saveVoted(book.id);
			$('#feedback').html('<label class="text-success">Message sent!</label>');
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log('Enter on error');
			saveVoted(book.id);
			$('#feedback').html('<label class="text-success">Message sent!</label>');
	    }
	});
    
}

function rate($this){

	rating = $this.data("star");
	$('.my-star').each(function(i, e){
		if(i<rating) {
			$(e).addClass("is-active");
		} else {
			$(e).removeClass("is-active");
		}
	});
	
	console.log("Rate: " + rating);
}

function saveVoted(id) {
	voted.push(id);
	if(storage){
		localStorage.setItem("voted", voted.join(","));
	}
}

function saveNoLlegit(id) {
	
}

function statistics(book) {
	if(book.isNew) {
		book.isTranslation ? nt++ : nc++;
	} else if(book.isPopular) {
		book.isTranslation ? pt++ : pc++;
	} else {
		r++;
	}
}

function logStats() {
	console.log( "NC: " + nc  + " NT: " + nt + " PC: " + pc + " PT: " + pt + " R: " + r);
}


/**
entry.2132131866: usuari
entry.1545437935: id
entry.1693883818: obra
entry.766523435: autor
entry.437166774: val
*/