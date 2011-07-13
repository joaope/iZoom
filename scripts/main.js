function $(elementId)
{
    return document.getElementById(elementId);
}

function i18n(messageName, substitutions)
{
    return chrome.i18n.getMessage(messageName, substitutions)
}