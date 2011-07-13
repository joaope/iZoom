/************* OPTIONS *****************/
zoomIsFunctional = (defaultOptions.enabled && !isException(window.location.toString()) ? true : false);
zoomMode = defaultOptions.zoomMode;
zoomMaximumAllow = defaultOptions.maximumZoomAllowed;
zoomErrorMargin = defaultOptions.errorMargin;

function fillOptions(optionName)
{
    chrome.extension.sendRequest({type: "options", location: window.location.toString()}, function(response) {
	zoomMode = response.zoomMode;
	zoomErrorMargin = response.errorMargin;
	zoomMaximumAllow = response.maximumZoomAllowed;
	zoomIsFunctional = (response.enabled && !response.isException ? true : false);
    });
}

/***************************************/
	
function zoom()
{
    if (!zoomIsFunctional ||
	document.body == null ||
	window.outerWidth < 1) 
    {
	return;
    }
    
    var clientWidth = document.body.clientWidth;
    var scrollWidth = document.body.scrollWidth;
    var hasHorizontalScrollbar = (clientWidth < scrollWidth);
    
    if (zoomMode == zoomModes.ShrinkOnly)
    {
	if (hasHorizontalScrollbar)
	{
	    zoomIsFunctional = false;
	    document.body.style.zoom = ((clientWidth * 100 / scrollWidth) - zoomErrorMargin) + "%";
	    setTimeout(turnZoomOn, 20);
	}
	else
	{
	    document.body.style.zoom = "100%";
	}
    }
    else
    {
	var realstatePercentage = (window.innerWidth * 100 / screen.width) / 100;
	var zoom = (zoomMaximumAllow * realstatePercentage);
	
	if (zoomMode == zoomModes.GrowOnly && zoom < 100)
	{
	    zoom = 100;
	}
	
	zoomIsFunctional = false;
	document.body.style.zoom = zoom + "%";
	setTimeout(turnZoomOn, 10);
    }
}

function turnZoomOn() {
    zoomIsFunctional = true;
}

window.onresize = function()
{
    zoom();
}

window.onload = function()
{
    zoom();
}

fillOptions();
