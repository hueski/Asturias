// JavaScript Document
$(document).ready(function(){
   init();
});
var layers=[];
var grupos=[];
var map;
var geoserver="";

function seleccionar_geoserver(wms)
{	
	if (wms=="geoserver")
	{
		geoserver="http://localhost:8080/geoserver/wms";
		crear_menu();
	}
	else
	{		var formulario_wms= "<div id=\"addCapas\">"+
								"<label>Introduzca Wms:</label>"+
								"<input type=\"text\"  id=\"wms\"/>"+
								"<button onclick='seleccionar_wms()' id=\"botonInsertar\" class=\"btn btn-primary \">Buscar Capas</button>"
		//var formulario_wms = "<form>Introduzca direccion wms <textarea  id=\"wms\"  /></form><button onclick='seleccionar_wms()'id='enviar'>Enviar wms</button>";
		 $('#menugeo').empty().append(formulario_wms);
		 
	}
	
}


function seleccionar_wms()
{
	var wms=document.getElementById("wms").value;
	if (wms)
	{
		geoserver=""+wms+"";
		crear_menu();	
		}
		
}

function init()
{

  map = new ol.Map({
                target: 'map',  // The DOM element that will contains the map
                renderer: 'canvas', // Force the renderer to be used
				//layers: [layerOSM],
                // Create a view centered on the specified location and zoom level
                view: new ol.View({
     				projection: ('EPSG:4230', 'EPSG:900913'),
    				center:[-434915.610107824, 5380511.6665677687],
    				zoom:12
                })
            }); 


}


function crear_menu()
{
	//console.log("si pasa");
	var parser = new ol.format.WMSCapabilities();
$.ajax({
		 type: "GET",
		 jsonp: "callback",
		  dataType: 'text',
		   url: geoserver+'?request=getCapabilities&service=wms',
	
			 crossDomain : true,

	})
	.then(function(response) {
		//console.log(response);
	   
       
	   layers=[];
        var c = parser.read(response);
		var capability = c.Capability;
		 for(var i = 0; i < capability.Layer.Layer.length; i ++){
                layers.push(capability.Layer.Layer[i].Name);
				//aqui debemos sacar el campo abstract, ya que nos dice si la capa es un grupo o no
				grupos.push(capability.Layer.Layer[i].Abstract)
				
            }
		console.log(c);
       //en este bucle divido las capas obtenidas en el GetCapabilities en grupos de capas y capas sueltas

		var codigocapas="<div id=\"addCapas\">"+
						"<label>Capas disponibles:</label>"+
  						"<input type=\"text\" list=\"capas\" id=\"nombrecapa\"/>"+
						"<button onclick='addLayer()' id=\"botonInsertar\" class=\"btn btn-primary \">Insertar capa</button>"+
						"<datalist id=\"capas\">"
  						
			for(var j = 0; j < layers.length; j ++)
				{
					//if(!grupos[j]){
						
							codigocapas += "<option value='"+layers[j]+"'>";
						

		var codigogrupos="<h3>Grupos</h3>";
		/*var codigocapas="<div class=\"btn-group\">"+
  						"<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">"+
						"Titulo del boton <span class=\"caret\"></span>"+
  						"</button>"+
						"  <ul class=\"dropdown-menu\" role=\"menu\">";
			for(var j = 0; j < layers.length; j ++)
				{
					//if(!grupos[j]){
						
							codigocapas += "<li><a onclick=\"addLayer("+j+")\">"+layers[j]+"</a></li>";
						*/	
						/*}
					else
						{	
							codigogrupos += "<button onclick='addGroup("+j+")'>"+layers[j]+"</option>" ;
						}*/
				}
			
		//	codigogrupos +="</select>";
			codigocapas +="</datalist></div>";
			 $('#menugeo').empty().append(codigocapas);
			// $('#layertree2').empty().append(codigogrupos);
		
			
		});
	
	
}

/*
function addGroup(j)
{	
	var nombre=layers[j];
	
	var layerGroup = new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			url: geoserver,
			serverType:'geoserver',
			params:{
						'LAYERS':""+nombre+"", 'TILED':true
				}
			}),
			name:""+nombre+""
            });
	map.addLayer(layerGroup);
		map.getLayerGroup().set('name', 'Root');	 

	initializeTree();
	asignarNombre(map.getLayerGroup());	
}
		*/
		
function addLayer(){
	var capa=document.getElementById("nombrecapa").value;
    var newlayer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			url: geoserver,
			params:{
						'LAYERS':""+capa+"", 'TILED':true
				}
			//name:""+nombre+""
			}),
			name:""+capa+""
            });
	
	map.addLayer(newlayer);
	map.getLayerGroup().set('name', 'Root');	 
	
	updateTreeLayer();
	

}