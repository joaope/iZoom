/// <reference path="chrome//chrome.d.ts" />
/// <reference path="jsuri/jsuri.d.ts" />

var manager = new Options.OptionsManager();

// Badge
manager.setEnabledBadge();

function updateContextMenu() {
  chrome.contextMenus.update(
    enabledItem, {
      'checked': manager.getOption('Enabled')
    }
  );

  var zoomMode = <Options.ZoomMode>manager.getOption('ZoomMode');

  chrome.contextMenus.update(
    shrinkOnlyItem, {
      'checked': (zoomMode == Options.ZoomMode.ShrinkOnly ? true : false)
    }
  );

  chrome.contextMenus.update(
    growOnlyItem, {
      'checked': (zoomMode == Options.ZoomMode.GrowOnly ? true : false)
    }
  );

  chrome.contextMenus.update(
    shrinkAndGrowItem, {
      'checked': (zoomMode == Options.ZoomMode.ShrinkAndGrow ? true : false)
    }
  );
}

// Build context menus
var parentMenu = null;

var enabledItem = null;

var exceptionsMenu = null;
var exceptionCurrentURLItem = null;
var exceptionCurrentHostItem = null;

var shrinkOnlyItem = null;
var growOnlyItem = null;
var shrinkAndGrowItem = null;

var zoomMode = <Options.ZoomMode>manager.getOption('ZoomMode');

parentMenu = chrome.contextMenus.create({
  "type": 'normal',
  "title": Utils.i18n('extension_name'),
  "contexts": ['page']
});

exceptionsMenu = chrome.contextMenus.create({
  "type": 'normal',
  "title": Utils.i18n('options_exceptions_name'),
  "parentId": parentMenu
});

exceptionCurrentURLItem = chrome.contextMenus.create({
  "type": 'normal',
  "title": Utils.i18n('contextMenu_menuItem_exceptionAddCurrentPage'),
  "onclick": function onExceptionCurrentURLItem(info, tab) {
    var url = info.pageUrl;
    var confText = Utils.i18n('message_confirm_addURLToExceptionsList', url);

    if (confirm(confText)) {
      if (!manager.addException(url)) {
        alert(Utils.i18n('message_alert_urlAlreadyOnExceptionsList', url));
      }
    }
  },
  "parentId": exceptionsMenu
});

exceptionCurrentHostItem = chrome.contextMenus.create({
  "type": 'normal',
  "title": Utils.i18n('contextMenu_menuItem_exceptionAddCurrentHost'),
  "onclick": function onExceptionCurrentHostItem(info, tab) {
    var uri = new jsuri.Uri(info.pageUrl);
    var uriHostOnly = new jsuri.Uri();

    uriHostOnly.protocol(uri.protocol());
    uriHostOnly.host(uri.host());

    var exception = uriHostOnly.toString() + "(/*)";

    var confText = Utils.i18n('message_confirm_addHostToExceptionsList', exception);

    if (confirm(confText)) {
      if (!manager.addException(exception)) {
        alert(Utils.i18n('message_alert_hostAlreadyOnExceptionsList', exception));
      }
    }
  },
  "parentId": exceptionsMenu
});

chrome.contextMenus.create({
  "type": 'separator',
  "parentId": parentMenu
});

enabledItem = chrome.contextMenus.create({
  "type": 'checkbox',
  "title": Utils.i18n('options_enabled_name'),
  "checked": true,
  "onclick": function onEnabledItemClick(info, tab) {
    manager.setOption('Enabled', info.checked);
  },
  "parentId": parentMenu
});

chrome.contextMenus.create({
  "type": 'separator',
  "parentId": parentMenu
});

shrinkOnlyItem = chrome.contextMenus.create({
  "type": 'radio',
  "title": Utils.i18n('options_zoomMode_shrinkOnly'),
  "checked": (zoomMode == Options.ZoomMode.ShrinkOnly ? true : false),
  "onclick": function onShrinkOnlyItemClick(info, tab) {
    if (info.checked) {
      manager.setOption('ZoomMode', Options.ZoomMode.ShrinkOnly);
    }
  },
  "parentId": parentMenu
});

growOnlyItem = chrome.contextMenus.create({
  "type": 'radio',
  "title": Utils.i18n('options_zoomMode_growOnly'),
  "checked": (zoomMode == Options.ZoomMode.GrowOnly ? true : false),
  "onclick": function onGrowOnlyItemClick(info, tab) {
    if (info.checked) {
      manager.setOption('ZoomMode', Options.ZoomMode.GrowOnly);
    }
  },
  "parentId": parentMenu
});

shrinkAndGrowItem = chrome.contextMenus.create({
  "type": 'radio',
  "title": Utils.i18n('options_zoomMode_shrinkAndGrow'),
  "checked": (zoomMode == Options.ZoomMode.ShrinkAndGrow ? true : false),
  "onclick": function onShrinkAndGrowItemClick(info, tab) {
    if (info.checked) {
      manager.setOption('ZoomMode', Options.ZoomMode.ShrinkAndGrow);
    }
  },
  "parentId": parentMenu
});


// Handle context script requests
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === "updateContextMenu") {
      updateContextMenu();
      sendResponse({});
    } else if (request.type == "options") {
      // Send response
      sendResponse
        ({
          enabled: manager.getOption('Enabled'),
          zoomMode: manager.getOption('ZoomMode'),
          maximumZoomAllowed: manager.getOption('MaximumZoomAllowed'),
          minimumZoomAllowed: manager.getOption('MinimumZoomAllowed'),
          isException: manager.isException(request.location)
        });
    }
  });
