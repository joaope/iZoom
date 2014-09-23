// Badge
options.setEnabledBadge(); 

// Context menu items callbaks
function onEnabledItemClick(info, tab)
{
	options.setOption('Enabled', info.checked);
}

function onShrinkOnlyItemClick(info, tab)
{
	if (info.checked)
	{
		options.setOption('ZoomMode', zoomModes.ShrinkOnly);
	}
}

function onGrowOnlyItemClick(info, tab)
{
	if (info.checked)
	{
		options.setOption('ZoomMode', zoomModes.GrowOnly);
	}
}

function onShrinkAndGrowItemClick(info, tab)
{
	if (info.checked)
	{
		options.setOption('ZoomMode', zoomModes.ShrinkAndGrow);
	}
}

function updateContextMenu()
{
	chrome.contextMenus.update(
		enabledItem,
		{
			'checked': options.getOption('Enabled')
		}
	);
	
	var zoomMode = options.getOption('ZoomMode');
	
	chrome.contextMenus.update(
		shrinkOnlyItem,
		{
			'checked': (zoomMode == zoomModes.ShrinkOnly ? true : false)
		}
	);
	
	chrome.contextMenus.update(
		growOnlyItem,
		{
			'checked': (zoomMode == zoomModes.GrowOnly ? true : false)
		}
	);
	
	chrome.contextMenus.update(
		shrinkAndGrowItem,
		{
			'checked': (zoomMode == zoomModes.ShrinkAndGrow ? true : false)
		}
	);
}

function onExceptionCurrentURLItem(info, tab)
{
	var url = info.pageUrl;
	var confText = i18n('message_confirm_addURLToExceptionsList', url);
	
	if (confirm(confText))
	{
		if (!options.addException(url))
		{
			alert(i18n('message_alert_urlAlreadyOnExceptionsList', url));
		}
	}
}

function onExceptionCurrentHostItem(info, tab)
{
	var uri = new jsUri(info.pageUrl);
	var uriHostOnly = new jsUri();
	
	uriHostOnly.protocol(uri.protocol());
	uriHostOnly.host(uri.host());
	
	var exception = uriHostOnly.toString() + "(/*)";

	var confText = i18n('message_confirm_addHostToExceptionsList', exception);
	
	if (confirm(confText))
	{
		if (!options.addException(exception))
		{
			alert(i18n('message_alert_hostAlreadyOnExceptionsList', exception));
		}
	}
}
 
// Build context menus
parentMenu = null;

enabledItem = null;

exceptionsMenu = null;
exceptionCurrentURLItem = null;
exceptionCurrentHostItem = null;

shrinkOnlyItem = null;
growOnlyItem = null;
shrinkAndGrowItem = null;

var zoomMode = options.getOption('ZoomMode');

parentMenu = chrome.contextMenus.create({
	"type": 'normal',
	"title": i18n('extension_name'),
	"contexts": ['page']
});

exceptionsMenu = chrome.contextMenus.create({
	"type": 'normal',
	"title": i18n('options_exceptions_name'),
	"parentId": parentMenu
});

exceptionCurrentURLItem = chrome.contextMenus.create({
	"type": 'normal',
	"title": i18n('contextMenu_menuItem_exceptionAddCurrentPage'),
	"onclick": onExceptionCurrentURLItem,
	"parentId": exceptionsMenu
});

exceptionCurrentHostItem = chrome.contextMenus.create({
	"type": 'normal',
	"title": i18n('contextMenu_menuItem_exceptionAddCurrentHost'),
	"onclick": onExceptionCurrentHostItem,
	"parentId": exceptionsMenu
});

chrome.contextMenus.create({"type": 'separator',"parentId": parentMenu});

enabledItem = chrome.contextMenus.create({
	"type": 'checkbox',
	"title": i18n('options_enabled_name'),
	"checked": true,
	"onclick": onEnabledItemClick,
	"parentId": parentMenu
});

chrome.contextMenus.create({"type": 'separator',"parentId": parentMenu});

shrinkOnlyItem = chrome.contextMenus.create({
	"type": 'radio',
	"title": i18n('options_zoomMode_shrinkOnly'),
	"checked": (zoomMode == zoomModes.ShrinkOnly ? true : false),
	"onclick": onShrinkOnlyItemClick,
	"parentId": parentMenu
});

growOnlyItem = chrome.contextMenus.create({
	"type": 'radio',
	"title": i18n('options_zoomMode_growOnly'),
	"checked": (zoomMode == zoomModes.GrowOnly ? true : false),
	"onclick": onGrowOnlyItemClick,
	"parentId": parentMenu
});

shrinkAndGrowItem = chrome.contextMenus.create({
	"type": 'radio',
	"title": i18n('options_zoomMode_shrinkAndGrow'),
	"checked": (zoomMode == zoomModes.ShrinkAndGrow ? true : false),
	"onclick": onShrinkAndGrowItemClick,
	"parentId": parentMenu
});
		

// Handle context script requests
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse)
	{
		if (request.type == "updateContextMenu")
		{
			updateContextMenu();
			sendResponse({});
		}
		else if (request.type == "options")
		{
			// Send response
			sendResponse
			({
				enabled: options.getOption('Enabled'),
				zoomMode: options.getOption('ZoomMode'),
				maximumZoomAllowed: options.getOption('MaximumZoomAllowed'),
				isException: options.isException(request.location)
			});
		}
	});