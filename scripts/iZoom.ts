/// <reference path="ZoomMode.ts"/>

var zoomIsFunctional: boolean = null;
var zoomMode: Options.ZoomMode = null;
var zoomMaximumAllow: number = null;
var zoomMinimumAllow: number = null;

var optionsFilled = false;

function zoomLogic() {
  if (!zoomIsFunctional) {
    return;
  }

  var realstatePercentage = (window.innerWidth * 100 / screen.width) / 100;
  var zoom = (zoomMaximumAllow * realstatePercentage);

  if (zoomMode == Options.ZoomMode.ShrinkOnly) {
    if (zoom > 100) {
      zoom = 100;
    } else if (zoomMinimumAllow > 0 && zoom < zoomMinimumAllow) {
      zoom = zoomMinimumAllow;
    }
  } else if (zoomMode == Options.ZoomMode.GrowOnly) {
    if (zoom < 100) {
      zoom = 100;
    }
  } else {
    if (zoomMinimumAllow > 0 && zoom < 100 && zoom < zoomMinimumAllow) {
      zoom = zoomMinimumAllow;
    }
  }

  document.body.parentElement.style.zoom = zoom + "%";
};

function zoom() {
  if (optionsFilled) {
    zoomLogic();
  } else {
    chrome.runtime.sendMessage({
        type: "options",
        location: window.location.toString()
      },
      function(response: any) {
        zoomMode = <Options.ZoomMode>response.zoomMode;
        zoomMaximumAllow = response.maximumZoomAllowed;
        zoomMinimumAllow = response.minimumZoomAllowed;
        zoomIsFunctional = (response.enabled && !response.isException ? true : false);

        optionsFilled = true;

        zoomLogic();
      }
    );
  }
}

var observer = new MutationObserver(function(mutations, observer) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length === 1 && mutation.addedNodes[0].nodeName === "BODY") {
      zoom();
      observer.disconnect();
    }
  });
});

observer.observe(document, {
  childList: true,
  subtree: true
});

window.onresize = function() {
  zoom();
}
