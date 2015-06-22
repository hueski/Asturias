// JavaScript Document
$(document).ready(function(){
   init();
});
var layers=[];
var grupos=[];
var map;
var layersGroupedNames = [];
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
			var formulario_wms= "<div id=\"addCapas\">"+
								"<label>Introduzca Wms:</label>"+
								"<input type=\"text\"  id=\"wms\"/>"+
								"<button onclick='seleccionar_wms()' id=\"botonInsertar\" class=\"btn btn-primary \">Buscar Capas</button>"
		 $('#menugeo2').empty()
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

	var parser = new ol.format.WMSCapabilities();
$.ajax({
		 type: "GET",
		 jsonp: "callback",
		  dataType: 'text',
		   url: geoserver+'?request=getCapabilities&service=wms',
	
			 crossDomain : true,

	})
	.then(function(response) {
	   layers=[];
        var c = parser.read(response);
		var capability = c.Capability;
		 for(var i = 0; i < capability.Layer.Layer.length; i ++){
                layers.push(capability.Layer.Layer[i].Name);
				//aqui debemos sacar el campo abstract, ya que nos dice si la capa es un grupo o no
				grupos.push(capability.Layer.Layer[i].Abstract)
				
            }
		
       //en este bucle divido las capas obtenidas en el GetCapabilities en grupos de capas y capas sueltas
				var codigogrupos=	"<div id=\"addGrupos\">"+
									"<select data-placeholder=\"Selecciona un grupo\" id=\"nombregrupo\" class=\"chosen-grupo\" style=\"width:350px;\" tabindex=\"1\">"+
									"<option value=\"\"></option>"	
		
  				var	codigocapas=	"<div id=\"addCapas\">"+
									"<select data-placeholder=\"Selecciona una capa\" id=\"nombrecapa\" class=\"chosen-select\" style=\"width:350px;\" tabindex=\"1\">"+
						 			"<option value=\"\"></option>"	
            for(var j = 0; j < layers.length; j ++)
				{
                		if(grupos[j] && grupos[j].includes("Layer-Group"))
						{
							codigogrupos += "<option value='"+layers[j]+"'>"+layers[j]+"</option>";
							 
						}
						else
						{
               			codigocapas += "<option value='"+layers[j]+"'>"+layers[j]+"</option>";
						
						}
				}
			
			codigogrupos +="</select><button onclick='addGroup()' id=\"botonInsertar\" class=\"btn btn-primary \">Insertar Grupo</button></div>";
			//codigocapas +="</datalist></div>";
			codigocapas +="</select><button onclick='addLayer()' id=\"botonInsertar\" class=\"btn btn-primary \">Insertar Capa</button></div>";
			 $('#menugeo').empty().append(codigocapas);
			 $('.chosen-select').chosen({width:"50%"});
			 $('#menugeo2').empty().append(codigogrupos);
			 $('.chosen-grupo').chosen({width:"50%"});

		});

}

function addGroup()
{	
	var nombre=document.getElementById("nombregrupo").value;
	 requestLayersForGroup(nombre, geoserver, function(layersInGroup){
            if(layersInGroup.length == 0){
                console.log("eing" + nombre);
                addLayer();
                return;
            }
            var layerGroup = new ol.layer.Group({
                layers: layersInGroup ,
				name: ""+nombre+""
            });
          //  layerGroup.name = nombre;
            map.addLayer(layerGroup);
			
        });
		$(document).ajaxStop(function(){ updateTreeLayer() });
		
}	
		
function addLayer(){
	console.log(geoserver)
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
	 updateTreeLayer();
	
	

}

function requestLayersForGroup(groupName, WMSUrl, callback){
    $.ajax({
        url: WMSUrl + "?request=DescribeLayer&service=WMS&version=1.1.1&outputformat=application/json&layers=" + groupName,
        type: "GET",
        complete: function (response){
            try{
                var objectResponse = JSON.parse(response.responseText);
            }catch(error){
                callback([]);
                return;
            }
            var groupLayers = [];
            objectResponse.layerDescriptions.forEach(function (layer){
				var nombre = layer.layerName.split(":")[1];
                var groupLayer = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        preload: Infinity,
                        url: WMSUrl,
                        servertype: "geoserver",
                        params:{ "LAYERS": layer.layerName.split(":")[1], "TILED": true}
						
                    }),
					name:""+nombre+""
                });
                groupLayer.name = layer.layerName.split(":")[1];
                layersGroupedNames.push(layer.layerName.split(":")[1]);
                groupLayers.push(groupLayer);
            });
            callback(groupLayers);
        }
    });
}

function resetGlobalVariables(){
    layers=[];
    grupos=[];
    layersGroupedNames = [];
}