

function updateTreeLayer(){
  
        var treeData = generateTreeData();
        createLayerTree(treeData);
    
}

function generateNode(layer){
	console.log(layer.name);
    var node = {text: layer.n.name, nodes: [], layer: layer, state: {checked: true}};
    if (layer instanceof ol.layer.Group){
        layer.getLayers().forEach(function(subLayer, indexInGroup){
            node.nodes.push(generateNode(subLayer));
        });
    }
	else
	{	
		var legend=create_legend(layer);
		var prueba ={text: legend}
		node.nodes.push(prueba);
		
	}
    return node;
}

function generateTreeData(){
    var treeData = [{text: "Mapa", nodes: [], state: {checked: true}}];
    map.getLayers().forEach(function(layer, index){
       treeData[0].nodes.push(generateNode(layer));
    });
    return treeData;
}

function createLayerTree(data){
    $("#layersTree").treeview({
        data: data,
        showCheckbox: true,
        onNodeChecked: function(event, node){
            if (node.layer) node.layer.setVisible(true);
            checkNodeChildrens(node);
			removeCheckboxLegendIcon()
        },
        onNodeUnchecked: function(event, node){
            if (node.layer) node.layer.setVisible(false);
            uncheckNodeChildrens(node);
			removeCheckboxLegendIcon()
        },
		onNodeExpanded: function(event, node){
            removeCheckboxLegendIcon();
        },
        onNodeSelected: function(event, node){
            removeCheckboxLegendIcon();
        }
	});
		
}

function uncheckNodeChildrens(node){
	if(!node.nodes){return;}
    node.nodes.forEach(function (childrenNode) {
        $('#layersTree').treeview("uncheckNode", childrenNode.nodeId);
    });
}

function checkNodeChildrens(node){
	if(!node.nodes){return;}
    node.nodes.forEach(function(childrenNode){
        $('#layersTree').treeview("checkNode", childrenNode.nodeId);
    });
}
function removeCheckboxLegendIcon(){
    setTimeout(function(){
        $(".legendIcon").siblings(".check-icon").css("visibility", "hidden");
    }, 0);
}