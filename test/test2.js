
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
	        data: list,
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
	              data: 'title',
	              "defaultContent": "",
	              width: "250px"
	            },
	            { data: 'author',
            	"defaultContent": "",
	              width: "250px" },
	            { data: 'publisher',
            	  "defaultContent": "",
	              width: "120px" },
	            { 
	              data: 'year', 
	              "defaultContent": "",
	              width: "80px"  
	            },
	            {
	            	data:null,
	            	render: function (data, type, full, meta) {
	            		return '<img src="'+data.imageUrl+'" width="100"/>';
	            	}
	            }
	          ],
	         order: [[0,"asc", 1, "asc"]]
	 });
}
