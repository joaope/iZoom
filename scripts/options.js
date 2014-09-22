var zoomModes = 
{
    ShrinkOnly: 0,
    GrowOnly: 1,
    ShrinkAndGrow: 2
}

options = (function()
{
    // Private variables
    var _localStoragePrefix = 'option-';
    
    // Private methods  
    function fullOptionName(optionName)
    {
        return _localStoragePrefix + optionName.toLowerCase();
    }
    
    // Public interface
    return {
        
        getDefaults: function()
        {
            return {
                enabled: true,
                zoomMode: zoomModes.ShrinkAndGrow,
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
                exceptions: new Array('http[s]?://mail.google.com(/*)')
            };
        },
        
        setOption: function(optionName, value)
        {
            localStorage[fullOptionName(optionName)] = value;
            
            if (optionName.toLowerCase() == 'enabled')
            {
                options.setEnabledBadge();
            }
        },
        
        getOption: function(optionName)
        {
            optionName = optionName.toLowerCase();
            var option = localStorage[fullOptionName(optionName)];
            
            switch(optionName)
            {
                case 'enabled':
                {
                    option = (option != 'false' ? true : false);
                    return option;
                }
                
                case 'zoommode':
                {
                    option = parseInt(option);
                    
                    if (!isNaN(option) && option >= 0 && option <= 2)
                    {
                        return (option == 0 ? zoomModes.ShrinkOnly : (option == 1 ? zoomModes.GrowOnly : zoomModes.ShrinkAndGrow));
                    }
                    return options.getDefaults().zoomMode;
                }
                
                case 'maximumzoomallowed':
                {
                    option = parseInt(option);
                    return (!isNaN(option) && option > 0 ? option : options.getDefaults().maximumZoomAllowed);
                }
                
                case 'errormargin':
                {
                    option = parseInt(option);
                    return (!isNaN(option) && option >= 0 ? option : options.getDefaults().errorMargin);    
                }
                
                case 'exceptions':
                {
                    var exceptions = (option != undefined && option.length > 0 ? option.split(',') : new Array());
                    return (option == undefined ? options.getDefaults().exceptions : exceptions);
                }
                
                default:
                {
                    throw new Error('getOption: invalid option: '+optionName);
                }
            }
        },
        
        addException: function(exception)
        {
            var exceptions = this.getOption('Exceptions');
    
            if (!this.isException(exception))
            {
                exceptions.push(exception);
                this.setOption('Exceptions', exceptions.toString());
                return true;
            }
            return false;
        },
        
        isException: function(url)
        {
            if (url != undefined || url instanceof String)
            {
                var exceptions = this.getOption('Exceptions');
                
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
        },
        
        setEnabledBadge: function()
        {
            var badgeText = (!options.getOption('Enabled') ? i18n('browserActions_offBadge') : "");
            chrome.browserAction.setBadgeText({text: badgeText});   
        }
    }
})();