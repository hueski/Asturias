var prueba = [];
var menucapas = "";
  function bindInputs(layerid, layer) {

  var visibilityInput = $(layerid + ' input.visible');
  visibilityInput.on('change', function() {
    layer.setVisible(this.checked);
  });
  visibilityInput.prop('checked', layer.getVisible());
  
	/*$.each(['opacity'],
	function(i, v) {
	var input = $(layerid + ' input.' + v);
	input.on('input change', function() {
	layer.set(v, parseFloat(this.value));
	});
	input.val(String(layer.get(v)));
	}
	);*/
}

function asignarNombre(layer) {
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
	
	bindInputs('#layer' + id, layer);
	if (layer.getLayers) {
		var layers = layer.getLayers().getArray(),
		len = layers.length;
		for (var i = len - 1; i >= 0; i--) {

			asignarNombre(layers[i]);
		}

	}

}


$('#menufeatures li > fieldset').click(function () {
	$(this).siblings('fieldset').toggle();
}).siblings('fieldset').hide();