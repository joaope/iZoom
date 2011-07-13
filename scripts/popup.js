function initPopup()
{
    // Do translation
    $('main-title').innerHTML = i18n('popup_quickOptions');
    
    $('enabled-name').innerHTML = i18n('options_enabled_name');
    $('enabled-yes-label').innerHTML = i18n('options_enabled_yes');
    $('enabled-no-label').innerHTML = i18n('options_enabled_no');
    
    $('zoomMode-name').innerHTML = i18n('options_zoomMode_name');
    $('zoomMode-shrinkOnly-label').innerHTML = i18n('options_zoomMode_shrinkOnly');
    $('zoomMode-growOnly-label').innerHTML = i18n('options_zoomMode_growOnly');
    $('zoomMode-shrinkAndGrow-label').innerHTML = i18n('options_zoomMode_shrinkAndGrow');
    
    $('require-reload').innerHTML = i18n('popup_requireReload');
    
    // Enabled
    var enabled = getOption('Enabled');
    
    if (enabled)
    {
        $('enabled-yes').checked = true;
        popupFormState(true);
    }
    else
    {
        $('enabled-no').checked = true;
        popupFormState(false);
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
}

function popupFormState(enabled)
{
    $('zoomMode-shrinkOnly').disabled =
        $('zoomMode-growOnly').disabled =
        $('zoomMode-shrinkAndGrow').disabled = !enabled;
}

function popupQuickSave() {
    // Enabled
    var enabled = ($('enabled-yes').checked ? "true" : "false");
    popupFormState($('enabled-yes').checked);
    setOption('Enabled', enabled);
    
    // Zoom Mode
    var mode = ($('zoomMode-shrinkOnly').checked ? 0 : ($('zoomMode-growOnly').checked ? 1 : 2));
    setOption('ZoomMode', mode);
    
    // Update context menu with new values
    chrome.extension.sendRequest({type: "updateContextMenu"}, function(response) {});
}