var map;
var mapDetails={};
var layersNames=[];
var grupos=[];
var layersGroupedNames = [];

/**
 * Stores in array map details, such as source WMS url, center and zoom.
 * @method setMapDetails
 * @param {} sentMapDetails
 * @return
 */
 
function setMapDetails(sentMapDetails){
    setMapURL(sentMapDetails["WMSUrl"]);
    mapDetails["WMSUrl"] = 'http://192.168.127.128:8080/geoserver/Prueba1/wms';
    //setMapURL("http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx");
    //mapDetails["WMSUrl"] = "http://ogc.bgs.ac.uk/cgi-bin/BGS_Bedrock_and_Superficial_Geology/wms";
    setMapCenter(sentMapDetails["center"]);
    setMapZoomLevel(sentMapDetails["zoom"]);
}

function setMapURL(WMSUrl){
    mapDetails["WMSUrl"] = WMSUrl;
}

function setMapCenter(center){
    mapDetails["center"] = center;
}

function setMapZoomLevel(zoomLevel){
    mapDetails["zoomLevel"] = zoomLevel;
}

function createMap() {
    map = new ol.Map({
        target: 'map',  // The DOM element that will contains the map
        interactions: ol.interaction.defaults({ doubleClickZoom: false }),
        renderer: 'canvas', // Force the renderer to be used
        // Create a view centered on the specified location and zoom level
        view: new ol.View({
            projection: ('EPSG:4230', 'EPSG:900913'),
            center: [-434915.610107824, 5380511.6665677687],
            zoom: 12
        })
    });

    if (mapDetails["WMSUrl"]) {
        try {
            addLayersAndGroupsFromWMS(mapDetails["WMSUrl"]);
        }catch (error){
            console.log("WOP");
        }

        //TEMPORAL
        var osmLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        osmLayer.name = "OpenStreet Maps";
        map.addLayer(osmLayer);

    }else{
        var osmLayer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        osmLayer.name = "OpenStreet Maps";
        map.addLayer(osmLayer);
    }
}

function destroyMap(){
    map.setTarget(null);
}

function updateMap(){
    destroyMap();
    createMap();
}
/*
function resetGlobalVariables(){
    layersNames=[];
    grupos=[];
    layersGroupedNames = [];
}*/

function addLayersAndGroupsFromWMS(WMSUrl){
    resetGlobalVariables();
    var parser = new ol.format.WMSCapabilities();
    $.ajax({
        type: "GET",
        jsonp: "callback",
        dataType: 'text',
        url: WMSUrl + '?request=getcapabilities&service=wms',
        crossDomain : true
    })
        .then(function(response) {
            var c = parser.read(response);
            var capability = c.Capability;
            for(var i = 0; i < capability.Layer.Layer.length; i ++){
                layersNames.push(capability.Layer.Layer[i].Name);
                //aqui debemos sacar el campo abstract, ya que nos dice si la capa es un grupo o no
                grupos.push(capability.Layer.Layer[i].Abstract)

            }
            for(var j = 0; j < layersNames.length; j ++) {
                if(grupos[j] && grupos[j].includes("Layer-Group")){
                    addGroupToMap(j, WMSUrl);
                    continue;
                }
                addLayerToMap(j, WMSUrl);
            }
        });
}


function addGroupToMap(groupIndex, WMSUrl) {
        var nombre=layersNames[groupIndex];
        requestLayersForGroup(nombre, WMSUrl, function(layersInGroup){
            if(layersInGroup.length == 0){
                console.log("eing" + nombre);
                addLayerToMap(groupIndex, WMSUrl);
                return;
            }
            var layerGroup = new ol.layer.Group({
                layers: layersInGroup
            });
            layerGroup.name = nombre;
            map.addLayer(layerGroup);
        });
}
/*
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
                var groupLayer = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        preload: Infinity,
                        url: WMSUrl,
                        servertype: "geoserver",
                        params:{ "LAYERS": layer.layerName.split(":")[1], "TILED": true}
                    })
                });
                groupLayer.name = layer.layerName.split(":")[1];
                layersGroupedNames.push(layer.layerName.split(":")[1]);
                searchAndRemoveLayer(groupLayer);
                groupLayers.push(groupLayer);
            });
            callback(groupLayers);
        }
    });
}
*/
function addLayerToMap(layerIndex, WMSUrl){
    var nombre = layersNames[layerIndex];
    if (layersGroupedNames.indexOf(nombre) != -1){
        return;
    }
    var newlayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            preload: Infinity,
            url: WMSUrl,
            serverType:'geoserver',
            params:{
                'LAYERS':""+nombre+"", 'TILED':true
            }
        })
    });
    newlayer.name = layersNames[layerIndex];
    map.addLayer(newlayer);
    return newlayer;
}

function searchAndRemoveLayer(layerToRemove){
    map.getLayers().forEach(function(layer){
       if (layer.name == layerToRemove.name){
           map.removeLayer(layer);
       }
    });
}