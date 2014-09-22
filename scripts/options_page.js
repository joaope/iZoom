document.addEventListener('DOMContentLoaded', initOptions);

var iZoomOptionsPageInitialized = false;

function initOptions()
{
    if (iZoomOptionsPageInitialized) {
        return;
    }
    
    iZoomOptionsPageInitialized = true;
    
    // Bind events
    $_('saveButtonTop').addEventListener('click', saveOptions);
    $_('cancelButtonTop').addEventListener('click', saveOptions);
    $_('loadDefaultsTop').addEventListener('click', loadDefaultOptions);
    $_('enabled-yes').addEventListener('change', function() { optionsFormState(true); });
    $_('enabled-no').addEventListener('change', function() { optionsFormState(false); });
    $_('saveButtonBottom').addEventListener('click', saveOptions);
    $_('cancelButtonBottom').addEventListener('click', saveOptions);
    $_('loadDefaultsBottom').addEventListener('click', loadDefaultOptions);
    
    // Do translation
    document.title = i18n('options_mainTitle');
    
    $_('main-title-name').innerHTML = i18n('options_mainTitle');
    $_('main-title-version').innerHTML = '(' + i18n('options_version') + ': ' + chrome.runtime.getManifest().version + ')';
    $_('main-title-logo').src = chrome.runtime.getManifest().icons["32"];
    
    $_('saveButtonTop').innerHTML = i18n('options_saveButton');
    $_('cancelButtonTop').innerHTML = i18n('options_cancelButton');
    $_('refreshWarningTop').innerHTML = i18n('options_refreshWarning');
    $_('loadDefaultsTop').innerHTML = i18n('options_loadDefaultsButton');
    $_('saveButtonBottom').innerHTML = i18n('options_saveButton');
    $_('cancelButtonBottom').innerHTML = i18n('options_cancelButton');
    $_('refreshWarningBottom').innerHTML = i18n('options_refreshWarning');
    $_('loadDefaultsBottom').innerHTML = i18n('options_loadDefaultsButton');
    
    $_('enabled-name').innerHTML = i18n('options_enabled_name');
    $_('enabled-yes-label').innerHTML = i18n('options_enabled_yes');
    $_('enabled-no-label').innerHTML = i18n('options_enabled_no');
    
    $_('zoomMode-name').innerHTML = i18n('options_zoomMode_name');
    $_('zoomMode-shrinkOnly-label').innerHTML = i18n('options_zoomMode_shrinkOnly');
    $_('zoomMode-growOnly-label').innerHTML = i18n('options_zoomMode_growOnly');
    $_('zoomMode-shrinkAndGrow-label').innerHTML = i18n('options_zoomMode_shrinkAndGrow');
    $_('zoomMode-shrinkOnly-explanation').innerHTML = i18n('options_zoomMode_shrinkOnlyExplanation');
    $_('zoomMode-growOnly-explanation').innerHTML = i18n('options_zoomMode_growOnlyExplanation');
    $_('zoomMode-shrinkAndGrow-explanation').innerHTML = i18n('options_zoomMode_shrinkAndGrowExplanation');
    
    $_('maxZoomAllowed-name').innerHTML = i18n('options_maxZoomAllowed_name');
    $_('maxZoomAllowed-percentage-explanation').innerHTML = i18n('options_maxZoomAllowed_percentageExplanation');
    
    $_('errorMargin-name').innerHTML = i18n('options_errorMargin_name');
    $_('errorMargin-percentage-explanation').innerHTML = i18n('options_errorMargin_percentageExplanation');
    
    $_('exceptions-name').innerHTML = i18n('options_exceptions_name');
    $_('exceptions-list-explanation').innerHTML = i18n('options_exceptions_listExplanation');
    $_('exceptions-list-usage').innerHTML = i18n('options_exceptions_listUsage');
    
    // Load options values
    loadOptions();
}

function loadOptions()
{
    // Enabled
    var enabled = options.getOption('Enabled');
    
    if (enabled)
    {
        $_('enabled-yes').checked = true;
        optionsFormState(true);
    }
    else
    {
        $_('enabled-no').checked = true;
        optionsFormState(false);
    }
    
    // Zoom Mode
    var zoomMode = options.getOption('ZoomMode');
    
    if (zoomMode == zoomModes.ShrinkOnly)
    {
        $_('zoomMode-shrinkOnly').checked = true;
    }
    else if (zoomMode == zoomModes.GrowOnly)
    {
        $_('zoomMode-growOnly').checked = true;
    }
    else
    {
        $_('zoomMode-shrinkAndGrow').checked = true;
    }
    
    // Maximum Zoom Allowed
    $_('maxZoomAllowed').value = options.getOption('MaximumZoomAllowed');
    
    // Error Margin
    $_('errorMargin').value = options.getOption('ErrorMargin');
    
    // Exceptions
    var exceptions = options.getOption('exceptions');
    
    for (i = 0; i < exceptions.length; i++)
    {
        $_('exceptions-list').value = $_('exceptions-list').value + (i != 0 ? '\n' : '') + exceptions[i];   
    }
}

function saveOptions()
{
    // Enabled
    var enabled = ($_('enabled-yes').checked ? "true" : "false");
    options.setOption('Enabled', enabled);
    
    // Zoom Mode
    var mode = ($_('zoomMode-shrinkOnly').checked ? 0 : ($_('zoomMode-growOnly').checked ? 1 : 2));
    options.setOption('ZoomMode', mode);
    
    // Maximum Zoom Allowed
    options.setOption('MaximumZoomAllowed', $_('maxZoomAllowed').value);
    
    // Error Margin
    options.setOption('ErrorMargin', $_('errorMargin').value);
    
    // Exceptions
    var exceptions = $_('exceptions-list').value.split(/\n/g).join(',');
    options.setOption('exceptions', exceptions);
    
    // Update context menu with new values
    chrome.extension.sendRequest({type: "updateContextMenu"}, function(response) {});
    
    // Close options window
    closeOptions();
}

function closeOptions()
{
    window.close();
}

function loadDefaultOptions()
{
    var defaults = options.getDefaults();
    
    $_('zoomMode-shrinkOnly').checked =
        $_('zoomMode-growOnly').checked =
        $_('zoomMode-shrinkAndGrow').checked = false;
        
    $_('exceptions-list').value = "";
    
    // Zoom Mode
    var zoomMode = defaults.zoomMode;
    
    if (zoomMode == zoomModes.ShrinkOnly)
    {
        $_('zoomMode-shrinkOnly').checked = true;
    }
    else if (zoomMode == zoomModes.GrowOnly)
    {
        $_('zoomMode-growOnly').checked = true;
    }
    else
    {
        $_('zoomMode-shrinkAndGrow').checked = true;
    }
    
    // Maximum Zoom Allowed
    $_('maxZoomAllowed').value = defaults.maximumZoomAllowed;
    
    // Error Margin
    $_('errorMargin').value = defaults.errorMargin.toString();
    
    // Exceptions
    var exceptions = defaults.exceptions;
    
    for (i = 0; i < exceptions.length; i++)
    {
        $_('exceptions-list').value = $_('exceptions-list').value + (i != 0 ? '\n' : '') + exceptions[i];   
    }
}

function optionsFormState(enabled)
{
    $_('zoomMode-shrinkOnly').disabled =
        $_('zoomMode-growOnly').disabled =
        $_('zoomMode-shrinkAndGrow').disabled =
        $_('maxZoomAllowed').disabled =
        $_('errorMargin').disabled =
        $_('exceptions-list').disabled = !enabled;
}