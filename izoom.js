switchModes = {
    Off: 0,
    On: 1
}

zoomModes = {
    ShrinkOnly: 0,
    GrowOnly: 1,
    ShrinkAndGrow: 2
}

zoomFunctionState = switchModes.On;
zoomMode = zoomModes.ShrinkOnly;

function bodyHasHorizontalScroll() {
    if (document.body.clientWidth < document.body.scrollWidth) {
	return true;
    }
    return false;
}
	
function zoom()
{
    if (zoomFunctionState == switchModes.Off ||
	document.body == null ||
	window.outerWidth < 1) 
    {
	return;
    }
    
    
    var clientWidth = document.body.clientWidth;
    var scrollWidth = document.body.scrollWidth;
    var hasHorizontalScrollbar = (clientWidth < scrollWidth);
    
    if (hasHorizontalScrollbar)
    {
	zoomFunctionState = switchModes.Off;
	document.body.style.zoom = ((clientWidth * 100 / scrollWidth) - 2) + "%";
	setTimeout(turnZoomOn, 10);
    }
    else {
	document.body.style.zoom = "100%";
    }
}

function turnZoomOn() {
    zoomFunctionState = switchModes.On;
}

window.onresize = function()
{
    zoom();
}

window.onload = function()
{
    zoom();
}