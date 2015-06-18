// JavaScript Document
function create_legend(layer)
{
	var name = layer.get('name');
	 var codigohtml ="<img class=\"legendIcon\" src='http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+name+"' />";
	return codigohtml
}