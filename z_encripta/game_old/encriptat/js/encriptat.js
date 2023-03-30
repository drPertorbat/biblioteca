class Encriptat {
    
    textCypher;
    titleCypher;
    dateFrom;
    dateTo;
    #text;
    #title;
    #author;
    #publisher;
    #translator;
    #note;
    #imageUrl;
    #url;
    #key;
    storage;
    

    constructor(storage){
        this.storage = storage;
        this.solution = {};
        //this.#text = "";
        //this.#title = "";
        //this.#author = "";
        //this.#key = "";
    }   



    fromJson(json){
        //Object.assign(this, json); 
        this.#author = json.author ? btoa(json.author) : ""; 
        this.#text = btoa(json.text);
        this.#title = json.title ? btoa(json.title) : "";
        this.#note = json.note ? btoa(json.note) : "";
        this.#imageUrl = json.imageUrl ? btoa(json.imageUrl) : "";
        this.#publisher = json.publisher ? btoa(json.publisher) : "";
        this.#translator = json.translator ? btoa(json.translator) : "";
        this.#url = json.url ? btoa(json.url) : "";
        this.dateFrom = json.dateFrom;
        this.dateTo = json.dateTo;
        
        this.startNew();
        this.init();
    }

    getTextCypher(){
        return this.textCypher;
    }

    getTitleCypher() {
        return this.titleCypher;
    }

    getDateFrom(){
        return this.dateFrom;
    }

    getDateTo(){
        return this.dateTo;
    }

    #getAuthor() {
        return atob(this.#author);
    }

    #getText() {
        return atob(this.#text);        
    }

    #getTitle() {
        return atob(this.#title);
    }

    #getKey(){
        return atob(this.#key);
    }

    #getNote(){
        return atob(this.#note);
    }

    #getImageUrl(){
        return atob(this.#imageUrl);
    }

    #getPublisher(){
        return atob(this.#publisher);
    }

    #getUrl() {
        return atob(this.#url);
    }

    #getTranslator() {
        return atob(this.#translator);
    }

    startNew() {
        this.#key = btoa(this.generateCypher());
        this.cleanSolution();
    }

    init(){
        var text = this.normalizeText2(this.#getText());
        var title = this.normalizeText2(this.#getTitle() + " - " + this.#getAuthor());
            
        this.textCypher = this.cypher2(text.toUpperCase());
        this.titleCypher = this.cypher2(title.toUpperCase());
       
        this.save();
    }

    save() {
        if(this.storage){
            localStorage.setItem("text", this.#text);
            localStorage.setItem("title", this.#title);
            localStorage.setItem("author", this.#author);
            localStorage.setItem("cypher", this.#key);
            localStorage.setItem("dateTo", this.dateTo);
            localStorage.setItem("dateFrom", this.dateFrom);
            localStorage.setItem("note", this.#note);
            localStorage.setItem("imageUrl", this.#imageUrl);
            localStorage.setItem("publisher", this.#publisher);
            localStorage.setItem("url", this.#url);
            localStorage.setItem("translator", this.#translator);
        }
    }

    loadGame() {
        if(!this.storage){
            return false;
        }

        this.#author = localStorage.author;
        this.#text = localStorage.text;
        this.#title = localStorage.title;
        this.#key = localStorage.cypher;
        this.#note = localStorage.note;
        this.#imageUrl = localStorage.imageUrl;
        this.#publisher = localStorage.publisher;
        this.#url = localStorage.url;
        this.#translator = localStorage.translator;
        this.dateFrom = localStorage.dateFrom;
        this.dateTo = localStorage.dateTo;
        if(localStorage.solution){
            this.solution = JSON.parse(localStorage.solution);
        }

        var lastDay = new Date(this.dateTo);
        lastDay.setHours(0,0,0,0);

        let today = new Date();
        today.setHours(0,0,0,0);

        if(lastDay < today){
            return false;
        }


        if(this.#author && this.#text && this.#title && this.#key) {
            this.init();
            this.display();
            this.restoreLetters();
            return true;
        } else {
            return false;
        }
    }

    display() {
        var full_text = [];
	    var text;
	    var w = $('#message').width();
	    var max_char = 25;
        var letter_width = 40;
        if(w <= 600) {
            letter_width = 25;
        }
        if( w/letter_width < 25) {
            max_char = Math.trunc(w/letter_width);
        }

        this.textToLines(this.textCypher, max_char, full_text);
        this.textToLines(this.titleCypher, max_char, full_text);
	
        for(var l=0; l<full_text.length; l++) {
            text = full_text[l];
            var $htmlLine = $('<div class="line"></div>');
            for (var i = 0; i<text.length; i++) {
                var letter = text[i];
                
                if(letter.toUpperCase() != letter.toLowerCase()){
                    $htmlLine.append('<div><input class=" letter letter_' + text[i] + '" value="" maxlength="1"  data-letter="' + text[i] + '"/><br>' + text[i] + '</div>');	
                } else {
                    //si no es lletra
                    $htmlLine.append('<div><input class="no-letter" value="' + text[i] + '" readonly disabled/><br> </div>');
                }
                
            }
            $('#message').append($htmlLine);
        }
    }

    restoreLetters() {
        if(this.solution){
            var solu = this.solution;
            $('input.letter').each(function(index, elem){
                var letter = $(elem).data("letter");
			    $(elem).val(solu[letter]);
            });
        }
    }

    addLetter(original, discovered){
        if(discovered.trim().length === 0) {
            delete this.solution[original];
        } else {
            this.solution[original] = discovered;
        }
        if(this.storage){
            localStorage.setItem("solution", JSON.stringify(this.solution));
        }
    }

    cleanSolution() {
        this.solution = {};
        if(this.storage){
	        localStorage.setItem("solution", JSON.stringify(this.solution));
        }
        $('input.error').removeClass("error");
    }
    cypher2(text) {
	
        var scramble = "";
        for(var i = 0; i< text.length; i++){
            var letter = text.toLowerCase()[i];
            if(letter.toUpperCase() != letter.toLowerCase()){
                var pos = text.charCodeAt(i);
                pos = pos - 65;
                if(pos > this.#getKey().length){
                    //ç
                    letter = this.#getKey()[this.#getKey().length - 1];
                } else {
                    letter = this.#getKey()[pos];
                }
            }
            scramble += letter;
        }
    
        return scramble;
    }

    normalizeText2(text) {

        text = text.toLowerCase()
                .replaceAll("à","a")
                .replaceAll("è","e")
                .replaceAll("é","e")
                .replaceAll("í","i")
                .replaceAll("ï","i")
                .replaceAll("ò","o")
                .replaceAll("ó","o")
                .replaceAll("ú","u")
                .replaceAll("ü","u");
        
        return text;
    }

    textToLines(text, max_char, full_text) {
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

    generateCypher() {
        var cypher = "";
        var alphat = "abcdefghijklmnopqrstuvwxyzç";
    
        while(alphat.length > 0){
            var pos = this.getRandomInt(0, alphat.length); 
            cypher += alphat.charAt(pos);
            alphat = alphat.slice(0, pos) + alphat.slice(pos+1);
        }
    
        return cypher;
    }
    
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    validateSolution() {
        
        var elements = $('.letter');
        for(let index = 0; index<elements.length; index++) {
            let elem = elements[index];
            var letter = $(elem).data("letter");
            if(!this.checkLetter($(elem).val(), letter)){
                return false;
            }
        }

        return true;
       
        
    }

    checkConflicts() {
        $('input.error').removeClass("error");

        let _solution = this.solution;
        var invertedSolution = Object.keys(this.solution).reduce((ret, key) => {
            if(!ret){
                ret = [];
            }
            if(!ret[_solution[key]]){
                ret[_solution[key]] = [];
            }
            ret[_solution[key]].push(key);
            return ret;
          }, {});

        var conflicts = Object.values(invertedSolution).filter(v => v.length > 1);

        conflicts.forEach((v,i) => {
            v.forEach(l => $('input.letter_' + l).addClass("error"));
        });
        
    }

    checkLetter(original, masked) {
        if(original.trim().length === 0){
            return false;
        }
        let alphat = "abcdefghijklmnopqrstuvwxyzç";
        let pos = alphat.indexOf(original.toLowerCase());
        return masked == this.#getKey()[pos];
    }
    
    showDialogWin(){
        $('#dialog-win .left-banner img').attr("src", this.#getImageUrl());
        $('#dialog-win .left-banner img').attr("alt", "Portada de " + this.#getTitle());
        $('#dialog-win .modal-info .book-title').html(this.#getTitle());
        $('#dialog-win .modal-info .author').html(this.#getAuthor());
        $('#dialog-win .modal-info .press').html(this.#getPublisher());
        if(this.#getTranslator()){
            $('#dialog-win .modal-info .translator').html("Traducció de: " + this.#getTranslator());
            $('#dialog-win .modal-info .translator').show();
        } else {
            $('#dialog-win .modal-info .translator').hide();
        }
        var sumary = '<p>' + this.#getNote() + 
        '</br>Més info: <a href="' + this.#getUrl() + '" target=”_blank”>' + this.#getPublisher() + '</a>' +
        '</p>';
        $('#dialog-win .modal-resume p').html(sumary);
        $('#dialog-win .modal-text p').html(this.#getText());
        $('#dialog-win').show();
    }    

    getTimeLeft() {
        let lastDay = new Date(this.getDateTo());
        lastDay.setDate(lastDay.getDate());
        let today = new Date();
        today.setHours(0,0,0,0);

        let difference = lastDay.getTime() - today.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    }
}