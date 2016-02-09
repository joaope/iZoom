document.addEventListener('DOMContentLoaded', initOptions);

var manager = new Options.OptionsManager();
var iZoomOptionsPageInitialized = false;

function initOptions() {
  if (iZoomOptionsPageInitialized) {
    return;
  }

  iZoomOptionsPageInitialized = true;

  // Bind events
  Utils._('enabled-yes').addEventListener('change', function() {
    optionsFormState(true);
  });
  Utils._('enabled-no').addEventListener('change', function() {
    optionsFormState(false);
  });
  Utils._('saveButtonBottom').addEventListener('click', saveOptions);
  Utils._('cancelButtonBottom').addEventListener('click', saveOptions);

  // Do translation
  document.title = Utils.i18n('options_mainTitle');

  var manifest = <any>chrome.runtime.getManifest();

  Utils._('header-bar-name').innerHTML = Utils.i18n('options_mainTitle');
  Utils._('header-bar-version').innerHTML = '(' + Utils.i18n('options_version') + ': ' + manifest.version + ')';
  Utils._('header-bar-logo').src = '/' + manifest.icons["32"];

  Utils._('saveButtonBottom').innerHTML = Utils.i18n('options_saveButton');
  Utils._('cancelButtonBottom').innerHTML = Utils.i18n('options_cancelButton');
  Utils._('refreshWarningBottom').innerHTML = Utils.i18n('options_refreshWarning');

  Utils._('enabled-name').innerHTML = Utils.i18n('options_enabled_name');
  Utils._('enabled-yes-label').innerHTML = Utils.i18n('options_enabled_yes');
  Utils._('enabled-no-label').innerHTML = Utils.i18n('options_enabled_no');

  Utils._('zoomMode-name').innerHTML = Utils.i18n('options_zoomMode_name');
  Utils._('zoomMode-shrinkOnly-label').innerHTML = Utils.i18n('options_zoomMode_shrinkOnly');
  Utils._('zoomMode-growOnly-label').innerHTML = Utils.i18n('options_zoomMode_growOnly');
  Utils._('zoomMode-shrinkAndGrow-label').innerHTML = Utils.i18n('options_zoomMode_shrinkAndGrow');
  Utils._('zoomMode-shrinkOnly-explanation').innerHTML = Utils.i18n('options_zoomMode_shrinkOnlyExplanation');
  Utils._('zoomMode-growOnly-explanation').innerHTML = Utils.i18n('options_zoomMode_growOnlyExplanation');
  Utils._('zoomMode-shrinkAndGrow-explanation').innerHTML = Utils.i18n('options_zoomMode_shrinkAndGrowExplanation');

  Utils._('maxZoomAllowed-name').innerHTML = Utils.i18n('options_maxZoomAllowed_name');
  Utils._('maxZoomAllowed-percentage-explanation').innerHTML = Utils.i18n('options_maxZoomAllowed_percentageExplanation');
  Utils._('minZoomAllowed-name').innerHTML = Utils.i18n('options_minZoomAllowed_name');
  Utils._('minZoomAllowed-percentage-explanation').innerHTML = Utils.i18n('options_minZoomAllowed_percentageExplanation');

  Utils._('exceptions-name').innerHTML = Utils.i18n('options_exceptions_name');
  Utils._('exceptions-list-explanation').innerHTML = Utils.i18n('options_exceptions_listExplanation');
  Utils._('exceptions-list-usage').innerHTML = Utils.i18n('options_exceptions_listUsage');

  // Load options values
  loadOptions();
}

function loadOptions() {
  // Enabled
  var enabled = manager.getOption('Enabled');

  if (enabled) {
    Utils._('enabled-yes').checked = true;
    optionsFormState(true);
  } else {
    Utils._('enabled-no').checked = true;
    optionsFormState(false);
  }

  // Zoom Mode
  var zoomMode = <Options.ZoomMode>manager.getOption('ZoomMode');

  if (zoomMode == Options.ZoomMode.ShrinkOnly) {
    Utils._('zoomMode-shrinkOnly').checked = true;
  } else if (zoomMode == Options.ZoomMode.GrowOnly) {
    Utils._('zoomMode-growOnly').checked = true;
  } else {
    Utils._('zoomMode-shrinkAndGrow').checked = true;
  }

  // Maximum Zoom Allowed
  Utils._('maxZoomAllowed').value = manager.getOption('MaximumZoomAllowed');

  // Minimum Zoom Allowed
  Utils._('minZoomAllowed').value = manager.getOption('MinimumZoomAllowed');

  // Exceptions
  var exceptions = manager.getOption('exceptions');

  for (var i = 0; i < exceptions.length; i++) {
    Utils._('exceptions-list').value = Utils._('exceptions-list').value + (i != 0 ? '\n' : '') + exceptions[i];
  }
}

function saveOptions() {
  // Enabled
  var enabled = (Utils._('enabled-yes').checked ? "true" : "false");
  manager.setOption('Enabled', enabled);

  // Zoom Mode
  var mode = (Utils._('zoomMode-shrinkOnly').checked ? 0 : (Utils._('zoomMode-growOnly').checked ? 1 : 2));
  manager.setOption('ZoomMode', mode);

  // Maximum Zoom Allowed
  manager.setOption('MaximumZoomAllowed', Utils._('maxZoomAllowed').value);

  // Minimum Zoom Allowed
  manager.setOption('MinimumZoomAllowed', Utils._('minZoomAllowed').value);

  // Exceptions
  var exceptions = Utils._('exceptions-list').value.split(/\n/g).join(',');
  manager.setOption('exceptions', exceptions);

  // Update context menu with new values
  chrome.runtime.sendMessage({
    type: "updateContextMenu"
  }, function(response) {});

  // Close options window
  closeOptions();
}

function closeOptions() {
  window.close();
}

function loadDefaultOptions() {
  var defaults = Options.OptionsManager.Defaults;

  Utils._('zoomMode-shrinkOnly').checked =
    Utils._('zoomMode-growOnly').checked =
    Utils._('zoomMode-shrinkAndGrow').checked = false;

  Utils._('exceptions-list').value = "";

  // Zoom Mode
  var zoomMode = defaults.zoomMode;

  if (zoomMode == Options.ZoomMode.ShrinkOnly) {
    Utils._('zoomMode-shrinkOnly').checked = true;
  } else if (zoomMode == Options.ZoomMode.GrowOnly) {
    Utils._('zoomMode-growOnly').checked = true;
  } else {
    Utils._('zoomMode-shrinkAndGrow').checked = true;
  }

  // Maximum Zoom Allowed
  Utils._('maxZoomAllowed').value = defaults.maximumZoomAllowed;

  // Minimum Zoom Allowed
  Utils._('minZoomAllowed').value = defaults.minimumZoomAllowed.toString();

  // Exceptions
  var exceptions = defaults.exceptions;

  for (var i = 0; i < exceptions.length; i++) {
    Utils._('exceptions-list').value = Utils._('exceptions-list').value + (i != 0 ? '\n' : '') + exceptions[i];
  }
}

function optionsFormState(enabled) {
  Utils._('zoomMode-shrinkOnly').disabled =
    Utils._('zoomMode-growOnly').disabled =
    Utils._('zoomMode-shrinkAndGrow').disabled =
    Utils._('maxZoomAllowed').disabled =
    Utils._('minZoomAllowed').disabled =
    Utils._('exceptions-list').disabled = !enabled;
}
