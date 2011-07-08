function getZoom()
{
    return (window.outerWidth/1024) * 100 - 10;
}
	
function zoom()
{
    if (document.body == null || window.outerWidth < 1) 
    {       
        setTimeout(zoom, 5); // hold-on 5 seconds and try again
        return;
    }
    document.body.style.zoom = getZoom() + "%";
}

zoom();
window.onresize = function() {
    zoom();
};