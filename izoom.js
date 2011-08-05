/************* OPTIONS *****************/
zoomIsFunctional = (options.getDefaults().enabled && !options.isException(window.location.toString()) ? true : false);
zoomMode = options.getDefaults().zoomMode;
zoomMaximumAllow = options.getDefaults().maximumZoomAllowed;
zoomErrorMargin = options.getDefaults().errorMargin;
zoomExemptedElementsZoomInCSSselectors = null;

function fillOptions(optionName)
{
    chrome.extension.sendRequest({type: "options", location: window.location.toString()}, function(response) {
	zoomMode = response.zoomMode;
	zoomErrorMargin = response.errorMargin;
	zoomMaximumAllow = response.maximumZoomAllowed;
	zoomIsFunctional = (response.enabled && !response.isException ? true : false);
	
	if (response.exemptImagesZoomIn)
	{
	    zoomExemptedElementsZoomInCSSselectors += "img, ";
	}
	if (response.exemptObjectsZoomIn)
	{
	    zoomExemptedElementsZoomInCSSselectors += "object, embed, ";
	}
	if (response.exemptAppletsZoomIn)
	{
	    zoomExemptedElementsZoomInCSSselectors += "applets, ";
	}
    });
}

/***************************************/
	
function zoom()
{
    if (document.body == null)
    {
	setTimeout(zoom, 10);
	return;
    }
    
    if (!zoomIsFunctional ||
	window.outerWidth < 1) 
    {
	return;
    }
    
    var realstatePercentage = (window.innerWidth * 100 / screen.width) / 100;
    var zoom = (zoomMaximumAllow * realstatePercentage);
    
    if ((zoomMode == zoomModes.ShrinkOnly && zoom > 100) ||
	(zoomMode == zoomModes.GrowOnly && zoom < 100))
    {
	zoom = 100;
    }
    
    zoomIsFunctional = false;
    document.body.parentElement.style.zoom = zoom + "%";

    if (zoomMode != zoomModes.ShrinkOnly && zoomExemptedElementsZoomInCSSselectors != null)
    {
	var styleElem = document.head.insertBefore(document.createElement('style'));
	styleElem.innerText = "img, object, embed { zoom: " + (zoom > 100 ? (100/zoom) : 'auto') + "; }\n";
    }
    
    setTimeout(turnZoomOn, 10);
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