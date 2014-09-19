zoomIsFunctional = (options.getDefaults().enabled && !options.isException(window.location.toString()) ? true : false);
zoomMode = options.getDefaults().zoomMode;
zoomMaximumAllow = options.getDefaults().maximumZoomAllowed;
zoomErrorMargin = options.getDefaults().errorMargin;
zoomExemptedElementsZoomInCSSselectors = null;

optionsFilled = false;

var zoomLogic = function()
{
    if (document.body == null || !zoomIsFunctional || window.outerWidth < 1) 
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

    document.body.parentElement.style.zoom = (zoom - zoomErrorMargin) + "%";

    if (zoomMode != zoomModes.ShrinkOnly && zoomExemptedElementsZoomInCSSselectors != null)
    {
		var styleElem = document.head.insertBefore(document.createElement('style'));
		styleElem.innerText = zoomExemptedElementsZoomInCSSselectors + " { zoom: " + (zoom > 100 ? (100/zoom) : 'auto') + "; }\n";
    }
};

function zoom()
{
	if (optionsFilled)
	{
		zoomLogic();
	}
	else
	{
		chrome.extension.sendRequest(
			{
				type: "options",
				location: window.location.toString()
			},
			function(response)
			{
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
				
				if (zoomExemptedElementsZoomInCSSselectors != null)
				{
					zoomExemptedElementsZoomInCSSselectors = zoomExemptedElementsZoomInCSSselectors.slice(0, -1);
				}
				
				optionsFilled = true;
				
				zoomLogic();
			}
		);
	}
}

var observer = new window.MutationObserver(function(mutations, observer) {  
  mutations.forEach(function(mutation) {
	  if (mutation.addedNodes.length == 1 && mutation.addedNodes[0].nodeName == "BODY") {
		zoom();
		observer.disconnect();
	  }
  });
});

observer.observe(document, { childList: true, subtree: true });

window.onresize = function()
{
    zoom();
}