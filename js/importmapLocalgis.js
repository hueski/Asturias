// JavaScript Document
var codigo_menu_localgis="";

function menu_localgis()
{
	codigo_menu_localgis="<h4>Seleccione el mapa que desea importar.</h4>";
	$.ajax({type: "GET",url: "php/localgisMaps.php",success: function(response) {

		var objeto=JSON.parse(response);
		//console.log(objeto);
				for(var i=0;i<objeto.length; i++){
					
					var nombre= objeto[i].mapName[0];
					var id = objeto[i].id_map;
					//console.log(nombre+"  "+id);
					codigo_menu_localgis +="<button class='menu_local' onclick=seleccion_mapa("+id+","+nombre+")>"+nombre+"</button>";
					
				}
					$('#layertree').empty().append(codigo_menu_localgis);
					},
error: function() {
					var error="<h1>Algo ha funcionado mal</h1>";
					 $('#layertree').empty().append(error);
					 
}


			});
	
}


function seleccion_mapa(varid,varnombre)
{
	
	console.log(id);
	$.ajax({
type: "POST",
url: "destino.php",
	data:
	{
		nombre: varnombre,
		id:varid,
		
		
	},
	success: function(response){
		
		}
	});
}
