// JavaScript Document
var codigo_menu_localgis="";

function menu_localgis()
{
		codigo_menu_localgis=		"<div id=\"addMapa\">"+
									"<select data-placeholder=\"Seleccione un Mapa\" id=\"nombreMapa\" class=\"chosen-select\" style=\"width:350px;\" tabindex=\"1\">"+
						 			"<option value=\"\"></option>"	
	$.ajax({type: "GET",url: "php/localgisMaps.php",success: function(response) {

		var objeto=JSON.parse(response);
		//console.log(objeto);
				for(var i=0;i<objeto.length; i++){
					
					var nombre= objeto[i].mapName[0];
					var id = objeto[i].id_map;
					
					codigo_menu_localgis +="<button class='menu_local' onclick=seleccion_mapa("+id+","+nombre+")>"+nombre+"</button>";
					
				}	$('#menugeo2').empty()
					$('#menugeo').empty().append(codigo_menu_localgis);
					},
error: function() {
					var error="<h1>Algo ha funcionado mal</h1>";	
					$('#menugeo2').empty()
					 $('#menugeo').empty().append(error);
					 
}
			});
}


function seleccion_mapa(varid,varnombre)
{
	
	$.ajax({
		type: "POST",
		url: "destino.php",
		data:{
		nombre: varnombre,
		id: varid,
		},
	success: function(response){
		
		}
	});
}
