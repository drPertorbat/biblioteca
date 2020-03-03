
var table;
$().ready(function(){
	
	
	
	init();
	

});

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
	              width: "120px"
	            },
	            { data: 'autors',
            	"defaultContent": "",
	              width: "250px" },
	            { data: 'editorial',
            	  "defaultContent": "",
	              width: "200px" },
	            { 
	              data: 'any', 
	              "defaultContent": "",
	              width: "320px"  
	            }       	            
	          ],
	         order: [[1,"asc", 2, "asc"]]
	 });
}