
var table;
$().ready(function(){
	
	
	
	init();
	

});

function generateLink(ed, title) {
	var path = "llibres";
	if(ed) {
		path = ed.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]/ig, "-");
	}
	
	var llibre = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]/ig, "-") + ".html";
	return "../" + path + "/" + llibre;
}

function init() {
	 table = $('#example').DataTable( {
	        data: data2,
	        columns: [
//	        	{ data: null,
//	        		render: function (data, type, full, meta) {
//	        			if(data.portada && data.portada.startsWith("http")){
//	        				return '<img src="'+ data.portada + '" style="height:50px" />';
//	        			} else {
//	        				return "";
//	        			}
//	        		},
//	        		width: "100px" },
	            { 
	              data: 'nom',
	              "defaultContent": "",
	              width: "250px"
	            },
	            { data: 'autors[; ]',
            	"defaultContent": "",
	              width: "250px" },
	            { data: 'editorial',
            	  "defaultContent": "",
	              width: "120px" },
	            { 
	              data: 'any', 
	              "defaultContent": "",
	              width: "80px"  
	            },
	            {
	            	data:null,
	            	render: function (data, type, full, meta) {
	            		if(data.portada && data.resum) {
	            			return '<a href="' + generateLink(data.editorial, data.nom) + '">Fitxa</a>'
	            		} else{
	            			return "";
	            		}
	            	}
	            }
	          ],
	         order: [[0,"asc", 1, "asc"]]
	 });
}
