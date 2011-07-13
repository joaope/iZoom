var zoomModes =
{
    ShrinkOnly: 0,
    GrowOnly: 1,
    ShrinkAndGrow: 2
}

defaultOptions =
{
    enabled: true,
    zoomMode: zoomModes.ShrinkOnly,
    // Calculate default MaxZoomAllowed value based on this
    // assumptions, founded after a few tests:
    //
    // Resolution Width  ->   Maximum Zoom Allowed
    //       1600                     150
    //       1280                     120
    //
    // m = 3/32
    //
    // y = 3/32x
    maximumZoomAllowed: Math.floor(3 / 32 * screen.width),
    errorMargin: 2,
    exceptions: new Array(
        "http[s]?://[a-zA-Z0-9_-]*.google.com(/*)"
    )
}

function setOption(optionName, value)
{
    localStorage['option-' + optionName.toLowerCase()] = value;

    if (optionName.toLowerCase() == 'enabled')
    {
        setBadge();
    }
}

function getOption(optionName)
{
    optionName = optionName.toLowerCase();
    var option = localStorage["option-" + optionName];
    
    switch(optionName)
    {
        case "enabled":
        {
            option = (option != "false" ? true : false);
            return option;
        }
        case "zoommode":
        {
            option = parseInt(option);
            
            if (option >= 0 && option <= 2)
            {
                return (option == 0 ? zoomModes.ShrinkOnly : (option == 1 ? zoomModes.GrowOnly : zoomModes.ShrinkAndGrow));
            }
            return defaultOptions.zoomMode;
        }
        
        case "maximumzoomallowed":
        {
            option = parseInt(option);
            return (option > 0 ? option : defaultOptions.maximumZoomAllowed);
        }
        
        case "errormargin":
        {
            option = parseInt(option);
            return (option >= 0 ? option : defaultOptions.errorMargin);    
        }
        
        case "exceptions":
        {
            var exceptions = (option != undefined && option.length > 0 ? option.split(',') : new Array());
            return (option == undefined ? defaultOptions.exceptions : exceptions);
        }
        
        default:
        {
            throw "getOption: invalid option";
        }
    }
}

function initOptions()
{
    // Do translation
    document.title = i18n('options_mainTitle');
    
    $('main-title').innerHTML = i18n('options_mainTitle');
    
    $('saveButtonTop').innerHTML = i18n('options_saveButton');
    $('cancelButtonTop').innerHTML = i18n('options_cancelButton');
    $('refreshWarningTop').innerHTML = i18n('options_refreshWarning');
    $('saveButtonBottom').innerHTML = i18n('options_saveButton');
    $('cancelButtonBottom').innerHTML = i18n('options_cancelButton');
    $('refreshWarningBottom').innerHTML = i18n('options_refreshWarning');
    
    $('enabled-name').innerHTML = i18n('options_enabled_name');
    $('enabled-yes-label').innerHTML = i18n('options_enabled_yes');
    $('enabled-no-label').innerHTML = i18n('options_enabled_no');
    
    $('zoomMode-name').innerHTML = i18n('options_zoomMode_name');
    $('zoomMode-shrinkOnly-label').innerHTML = i18n('options_zoomMode_shrinkOnly');
    $('zoomMode-growOnly-label').innerHTML = i18n('options_zoomMode_growOnly');
    $('zoomMode-shrinkAndGrow-label').innerHTML = i18n('options_zoomMode_shrinkAndGrow');
    $('zoomMode-shrinkOnly-explanation').innerHTML = i18n('options_zoomMode_shrinkOnlyExplanation');
    $('zoomMode-growOnly-explanation').innerHTML = i18n('options_zoomMode_growOnlyExplanation');
    $('zoomMode-shrinkAndGrow-explanation').innerHTML = i18n('options_zoomMode_shrinkAndGrowExplanation');
    
    $('maxZoomAllowed-name').innerHTML = i18n('options_maxZoomAllowed_name');
    $('maxZoomAllowed-percentage-explanation').innerHTML = i18n('options_maxZoomAllowed_percentageExplanation');
    
    $('errorMargin-name').innerHTML = i18n('options_errorMargin_name');
    $('errorMargin-percentage-explanation').innerHTML = i18n('options_errorMargin_percentageExplanation');
    
    $('exceptions-name').innerHTML = i18n('options_exceptions_name');
    $('exceptions-list-explanation').innerHTML = i18n('options_exceptions_listExplanation');
    $('exceptions-list-usage').innerHTML = i18n('options_exceptions_listUsage');
    
    // Load options values
    loadOptions();
}

function loadOptions()
{
    // Enabled
    var enabled = getOption('Enabled');
    
    if (enabled)
    {
        $('enabled-yes').checked = true;
        optionsFormState(true);
    }
    else
    {
        $('enabled-no').checked = true;
        optionsFormState(false);
    }
    
    // Zoom Mode
    var zoomMode = getOption("ZoomMode");
    
    if (zoomMode == zoomModes.ShrinkOnly)
    {
        $('zoomMode-shrinkOnly').checked = true;
    }
    else if (zoomMode == zoomModes.GrowOnly)
    {
        $('zoomMode-growOnly').checked = true;
    }
    else
    {
        $('zoomMode-shrinkAndGrow').checked = true;
    }
    
    // Maximum Zoom Allowed
    $('maxZoomAllowed').value = getOption("MaximumZoomAllowed");
    
    // Error Margin
    $('errorMargin').value = getOption("ErrorMargin");
    
    // Exceptions
    var exceptions = getOption('exceptions');
    
    for (i = 0; i < exceptions.length; i++)
    {
        $('exceptions-list').value = $('exceptions-list').value + (i != 0 ? '\n' : '') + exceptions[i];   
    }
}

function saveOptions()
{
    // Enabled
    var enabled = ($('enabled-yes').checked ? "true" : "false");
    setOption('Enabled', enabled);
    
    // Zoom Mode
    var mode = ($('zoomMode-shrinkOnly').checked ? 0 : ($('zoomMode-growOnly').checked ? 1 : 2));
    setOption('ZoomMode', mode);
    
    // Maximum Zoom Allowed
    setOption('MaximumZoomAllowed', $('maxZoomAllowed').value);
    
    // Error Margin
    setOption('ErrorMargin', $('errorMargin').value);
    
    // Exceptiopns
    var exceptions = $('exceptions-list').value.split(/\n/g).join(',');
    setOption('exceptions', exceptions);
    
    // Update context menu with new values
    chrome.extension.sendRequest({type: "updateContextMenu"}, function(response) {});
    
    // Close options window
    closeOptions();
}

function addException(exception)
{
    var exceptions = getOption('Exceptions');
    
    if (!isException(exception))
    {
        exceptions.push(exception);
        setOption('Exceptions', exceptions.toString());
        return true;
    }
    return false;
}

function isException(url)
{
    if (url != undefined || url instanceof String)
    {
        var exceptions = getOption('Exceptions');
        
        for (i = 0; i < exceptions.length; i++)
        {
            var regExp = new RegExp(exceptions[i]);
            
            if (regExp.test(url))
            {
                return true;
            }
        }
    }
    return false;
}

function optionsFormState(enabled)
{
    $('zoomMode-shrinkOnly').disabled =
        $('zoomMode-growOnly').disabled =
        $('zoomMode-shrinkAndGrow').disabled =
        $('maxZoomAllowed').disabled =
        $('errorMargin').disabled =
        $('exceptions-list').disabled = !enabled;
}

function loadDefaultOptions()
{
    $('zoomMode-shrinkOnly').checked =
        $('zoomMode-growOnly').checked =
        $('zoomMode-shrinkAndGrow').checked = false;
        
    $('exceptions-list').value = "";
    
    // Zoom Mode
    var zoomMode = defaultOptions.zoomMode;
    
    if (zoomMode == zoomModes.ShrinkOnly)
    {
        $('zoomMode-shrinkOnly').checked = true;
    }
    else if (zoomMode == zoomModes.GrowOnly)
    {
        $('zoomMode-growOnly').checked = true;
    }
    else
    {
        $('zoomMode-shrinkAndGrow').checked = true;
    }
    
    // Maximum Zoom Allowed
    $('maxZoomAllowed').value = defaultOptions.maximumZoomAllowed;
    
    // Error Margin
    $('errorMargin').value = defaultOptions.errorMargin;
    
    // Exceptions
    var exceptions = defaultOptions.exceptions;
    
    for (i = 0; i < exceptions.length; i++)
    {
        $('exceptions-list').value = $('exceptions-list').value + (i != 0 ? '\n' : '') + exceptions[i];   
    }
}

function setBadge()
{
    var badgeText = (!getOption('Enabled') ? i18n('browserActions_offBadge') : "");
    chrome.browserAction.setBadgeText({text: badgeText});   
}

function closeOptions()
{
    window.close();
}

