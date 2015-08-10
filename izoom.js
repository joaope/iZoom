zoomIsFunctional = null;
zoomMode = null;
zoomMaximumAllow = null;
zoomMinimumAllow = null;

optionsFilled = false;

var zoomLogic = function() {
  if (!zoomIsFunctional) {
    return;
  }

  var realstatePercentage = (window.innerWidth * 100 / screen.width) / 100;
  var zoom = (zoomMaximumAllow * realstatePercentage);

  if (zoomMode == zoomModes.ShrinkOnly) {
    if (zoom > 100) {
      zoom = 100;
    } else if (zoomMinimumAllow > 0 && zoom < zoomMinimumAllow) {
      zoom = zoomMinimumAllow;
    }
  } else if (zoomMode == zoomModes.GrowOnly) {
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
    chrome.extension.sendRequest({
        type: "options",
        location: window.location.toString()
      },
      function(response) {
        zoomMode = response.zoomMode;
        zoomMaximumAllow = response.maximumZoomAllowed;
        zoomMinimumAllow = response.minimumZoomAllowed;
        zoomIsFunctional = (response.enabled && !response.isException ? true : false);

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

observer.observe(document, {
  childList: true,
  subtree: true
});

window.onresize = function() {
  zoom();
}
