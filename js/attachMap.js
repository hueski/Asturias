$(document).ready(function(){
    attachMapEventHandler();
})

function attachMapEventHandler(){
    $("#attachMapButton").click(function(){
        attachMap($("#attachMapText").val());
    });
}

function attachMap(wmsURL){
    setMapURL(wmsURL);
    updateMap();
    updateTreeLayer();
}