// JavaScript Document
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
	{
		var formulario_wms = "<form>Introduzca direccion wms <textarea  id=\"wms\"  /></form><button onclick='seleccionar_wms()'id='enviar'>Enviar wms</button>";
		 $('#layertree').empty().append(formulario_wms);
		 
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
		//console.log(c);
       //en este bucle divido las capas obtenidas en el GetCapabilities en grupos de capas y capas sueltas

		var codigogrupos="<h3>Grupos</h3>";
		var codigocapas="<h3>Capas</h3>";
			for(var j = 0; j < layers.length; j ++)
				{
					//if(!grupos[j]){
							codigocapas += "<button onclick='addLayer("+j+")'>"+layers[j]+"</option>" ;
							
						/*}
					else
						{	
							codigogrupos += "<button onclick='addGroup("+j+")'>"+layers[j]+"</option>" ;
						}*/
				}
			
		//	codigogrupos +="</select>";
		//	codigocapas +="</select>";
			 $('#layertree').empty().append(codigocapas);
			// $('#layertree2').empty().append(codigogrupos);
		
			
		});
	
	
}


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
		
		
function addLayer(j){
	
	var nombre=layers[j];
    var newlayer = new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			url: geoserver,
			serverType:'geoserver',
			params:{
						'LAYERS':""+nombre+"", 'TILED':true
				}
			//name:""+nombre+""
			}),
			name:""+nombre+""
            });
	
	map.addLayer(newlayer);
	map.getLayerGroup().set('name', 'Root');	 
	
	initializeTree();
/*	console.log("esto va antes del asignar");
	//asignarNombre(map.getLayerGroup())
   			var capas = map.getLayers().getArray(),
   			len = capas.length;
			for ( var i = len-1 ; i >= 0; i--) {
								
     					asignarNombre(capas[i]);
                  }*/
}