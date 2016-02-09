document.addEventListener('DOMContentLoaded', initPopup);

var manager = new Options.OptionsManager();
var iZoomPopupInitialized = false;

function initPopup() {
  if (iZoomPopupInitialized) {
    return;
  }

  iZoomPopupInitialized = true;

  // Bind events
  Utils._('enabled-yes').addEventListener('click', popupQuickSave);
  Utils._('enabled-no').addEventListener('click', popupQuickSave);
  Utils._('zoomMode-shrinkOnly').addEventListener('click', popupQuickSave);
  Utils._('zoomMode-growOnly').addEventListener('click', popupQuickSave);
  Utils._('zoomMode-shrinkAndGrow').addEventListener('click', popupQuickSave);
  Utils._('advanced-options').addEventListener('click', function() {
    var optionsUrl = chrome.extension.getURL('html/options.html');

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
  Utils._('main-title').innerHTML = Utils.i18n('popup_quickOptions');

  Utils._('enabled-name').innerHTML = Utils.i18n('options_enabled_name');
  Utils._('enabled-yes-label').innerHTML = Utils.i18n('options_enabled_yes');
  Utils._('enabled-no-label').innerHTML = Utils.i18n('options_enabled_no');

  Utils._('zoomMode-name').innerHTML = Utils.i18n('options_zoomMode_name');
  Utils._('zoomMode-shrinkOnly-label').innerHTML = Utils.i18n('options_zoomMode_shrinkOnly');
  Utils._('zoomMode-growOnly-label').innerHTML = Utils.i18n('options_zoomMode_growOnly');
  Utils._('zoomMode-shrinkAndGrow-label').innerHTML = Utils.i18n('options_zoomMode_shrinkAndGrow');

  Utils._('require-reload').innerHTML = Utils.i18n('popup_requireReload');
  Utils._('advanced-options').innerHTML = Utils.i18n('popup_advancedOptions');

  // Enabled
  var enabled = manager.getOption('Enabled');

  if (enabled) {
    Utils._('enabled-yes').checked = true;
    popupFormState(true);
  } else {
    Utils._('enabled-no').checked = true;
    popupFormState(false);
  }

  // Zoom Mode
  var zoomMode = manager.getOption("ZoomMode");

  if (zoomMode == Options.ZoomMode.ShrinkOnly) {
    Utils._('zoomMode-shrinkOnly').checked = true;
  } else if (zoomMode == Options.ZoomMode.GrowOnly) {
    Utils._('zoomMode-growOnly').checked = true;
  } else {
    Utils._('zoomMode-shrinkAndGrow').checked = true;
  }
}

function popupFormState(enabled) {
  Utils._('zoomMode-shrinkOnly').disabled =
    Utils._('zoomMode-growOnly').disabled =
    Utils._('zoomMode-shrinkAndGrow').disabled = !enabled;
}

function popupQuickSave() {
  // Enabled
  var enabled = (Utils._('enabled-yes').checked ? "true" : "false");
  popupFormState(Utils._('enabled-yes').checked);
  manager.setOption('Enabled', enabled);

  // Zoom Mode
  var mode = (Utils._('zoomMode-shrinkOnly').checked ? 0 : (Utils._('zoomMode-growOnly').checked ? 1 : 2));
  manager.setOption('ZoomMode', mode);

  // Update context menu with new values
  chrome.runtime.sendMessage({
    type: "updateContextMenu"
  }, function(response) {});
}
