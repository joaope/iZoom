document.addEventListener('DOMContentLoaded', initPopup);

var iZoomPopupInitialized = false;

function initPopup() {
  if (iZoomPopupInitialized) {
    return;
  }

  iZoomPopupInitialized = true;

  // Bind events
  $_('enabled-yes').addEventListener('click', popupQuickSave);
  $_('enabled-no').addEventListener('click', popupQuickSave);
  $_('zoomMode-shrinkOnly').addEventListener('click', popupQuickSave);
  $_('zoomMode-growOnly').addEventListener('click', popupQuickSave);
  $_('zoomMode-shrinkAndGrow').addEventListener('click', popupQuickSave);
  $_('advanced-options').addEventListener('click', function() {
    var optionsUrl = chrome.extension.getURL('options.html');

    chrome.tabs.query({
      url: optionsUrl,
    }, function(results) {
      if (results.length) {
        chrome.tabs.update(results[0].id, {
          active: true
        });
      } else {
        chrome.tabs.create({
          url: optionsUrl
        });
      }
    })

    return false;
  });

  // Do translation
  $_('main-title').innerHTML = i18n('popup_quickOptions');

  $_('enabled-name').innerHTML = i18n('options_enabled_name');
  $_('enabled-yes-label').innerHTML = i18n('options_enabled_yes');
  $_('enabled-no-label').innerHTML = i18n('options_enabled_no');

  $_('zoomMode-name').innerHTML = i18n('options_zoomMode_name');
  $_('zoomMode-shrinkOnly-label').innerHTML = i18n('options_zoomMode_shrinkOnly');
  $_('zoomMode-growOnly-label').innerHTML = i18n('options_zoomMode_growOnly');
  $_('zoomMode-shrinkAndGrow-label').innerHTML = i18n('options_zoomMode_shrinkAndGrow');

  $_('require-reload').innerHTML = i18n('popup_requireReload');
  $_('advanced-options').innerHTML = i18n('popup_advancedOptions');

  // Enabled
  var enabled = options.getOption('Enabled');

  if (enabled) {
    $_('enabled-yes').checked = true;
    popupFormState(true);
  } else {
    $_('enabled-no').checked = true;
    popupFormState(false);
  }

  // Zoom Mode
  var zoomMode = options.getOption("ZoomMode");

  if (zoomMode == zoomModes.ShrinkOnly) {
    $_('zoomMode-shrinkOnly').checked = true;
  } else if (zoomMode == zoomModes.GrowOnly) {
    $_('zoomMode-growOnly').checked = true;
  } else {
    $_('zoomMode-shrinkAndGrow').checked = true;
  }
}

function popupFormState(enabled) {
  $_('zoomMode-shrinkOnly').disabled =
    $_('zoomMode-growOnly').disabled =
    $_('zoomMode-shrinkAndGrow').disabled = !enabled;
}

function popupQuickSave() {
  // Enabled
  var enabled = ($_('enabled-yes').checked ? "true" : "false");
  popupFormState($_('enabled-yes').checked);
  options.setOption('Enabled', enabled);

  // Zoom Mode
  var mode = ($_('zoomMode-shrinkOnly').checked ? 0 : ($_('zoomMode-growOnly').checked ? 1 : 2));
  options.setOption('ZoomMode', mode);

  // Update context menu with new values
  chrome.extension.sendRequest({
    type: "updateContextMenu"
  }, function(response) {});
}
