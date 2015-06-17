var ajaxQueue = [];
var numLayers;
var indexLayer;
var div_html = "<ul class='menu'>";

function initializeTree() {
	div_html = "";
	indexLayer=0;
	numLayers = map.getLayers().getLength();
	for (var i = 0; i < numLayers; i++) 
		
		generateJSONLayers(map.getLayers().item(i));
}

function generateJSONLayers(layer) {
	var features = [];
	getJSONLayer(layer, function (layerAttributes) {
		var name = layer.get('name');
		var id
		var separar=name.split(":")
			if(separar.length>1)
			{
					id=separar[1];
			}
			else
			{
					id=separar[0];
			}
		//console.log(name);
		div_html += "<li>"+
  						 	"<fieldset id='layer"+id+"'>" +
						  	"<label class='checkbox' for='layer"+id+"'>" +
						 	 "<input id='layer"+id+"' class='visible' type='checkbox'/>"+name+" "+
			  				"</label>"+
							"</fieldset>"
		var legend=create_legend(layer);
		div_html +=legend;

		if (layerAttributes) {
			features = layerAttributes;
 			var features_html = "";
			for (var j = 0; j < features.length; j++) 
				features_html += "<ul>" + features[j] + "</ul>";
			div_html += features_html + "</li>";
		}
	});
}

function getJSONLayer(layer, callback) {
	var source = layer.getSource();
	var ajaxPetition = getDescribeFeatureType(source.getUrls()[0], source.getParams()["LAYERS"], function (response) {
		callback(parseDescribeFeatureType(response));
		indexLayer++;
		if (indexLayer == numLayers){
			div_html += "</ul>";
			$('#layersTree').empty().append(div_html);
			asignarNombre(map.getLayerGroup());
		}
	});
	ajaxQueue.indexOf(ajaxPetition);
}

function getDescribeFeatureType(url, layers, callback) {
	$.ajax({
		url : url,
		data : {
			"SERVICE" : "WFS",
			"REQUEST" : "DescribeFeatureType",
			"typeName" : layers
		},
		method : "GET",
		disableCaching : false,
		success : function (response) {
			
			callback(response);
		}
	});
}

function parseDescribeFeatureType(XMLResponse) {
	var ResponseObject = JSON.parse(xmlToJson(XMLResponse));
	try {
		var featureAttributes = [];
		ResponseObject["xsd:complexType"]["xsd:complexContent"]["xsd:extension"]["xsd:sequence"]["xsd:element"].forEach(function (attribute) {
			featureAttributes.push(attribute["@name"]);
		});
		//prueba.push(featureAttributes);
		return featureAttributes; //{"id": ResponseObject["xsd:element"]["@name"], "features": featureAttributes};
	} catch (e) {
		//console.log(e);
		if (!ResponseObject["ows:Exception"]) {
			return {
				//"id" : ResponseObject["xsd:element"]["@name"],
				"features" : []
			};
		}
	}
}