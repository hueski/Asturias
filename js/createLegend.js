// JavaScript Document
function create_legend(layer,codigohtml)
{
	var name = layer.get('name');
	 var codigohtml ="<img src='http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=40&HEIGHT=40&LAYER="+name+"' />";
	return codigohtml
}