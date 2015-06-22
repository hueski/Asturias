// JavaScript Document
function create_legend(layer,wmsurl)
{
	var name = layer.get('name');
	 var htmlLegend = "<img class=\"legendIcon\""+ 
					  "src='"+wmsurl+"?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+name+"' />";
	return htmlLegend;
}