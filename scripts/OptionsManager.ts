module Options {
  export class OptionsManager {

    private localStoragePrefix: string = 'option-';

    public static Defaults: IOptions = {
      enabled: true,
      zoomMode: Options.ZoomMode.ShrinkAndGrow,
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
      minimumZoomAllowed: 0,
      exceptions: new Array('http[s]?://mail.google.com(/*)')
    };

    private fullOptionName(optionName: string) {
      return this.localStoragePrefix + optionName.toLowerCase();
    }

    public getOption(optionName: string) {
      optionName = optionName.toLowerCase();
      var option = localStorage[this.fullOptionName(optionName)];

      switch (optionName) {
        case 'enabled':
          {
            option = (option != 'false' ? true : false);
            return option;
          }

        case 'zoommode':
          {
            option = parseInt(option);

            if (!isNaN(option) && option >= 0 && option <= 2) {
              return (option === 0 ? ZoomMode.ShrinkOnly : (option == 1 ? ZoomMode.GrowOnly : ZoomMode.ShrinkAndGrow));
            }
            return OptionsManager.Defaults.zoomMode;
          }

        case 'maximumzoomallowed':
          {
            option = parseInt(option);
            return (!isNaN(option) && option > 0 ? option : OptionsManager.Defaults.maximumZoomAllowed);
          }

        case 'minimumzoomallowed':
          {
            option = parseInt(option);
            return (!isNaN(option) && option >= 0 && option < this.getOption('MaximumZoomAllowed') ? option : OptionsManager.Defaults.minimumZoomAllowed);
          }

        case 'exceptions':
          {
            var exceptions = (option != undefined && option.length > 0 ? option.split(',') : new Array());
            return (option == undefined ? OptionsManager.Defaults.exceptions : exceptions);
          }

        default:
          {
            throw new Error('getOption: invalid option: ' + optionName);
          }
      }
    }

    public addException(exception: string) {
      var exceptions = this.getOption('Exceptions');

      if (!this.isException(exception)) {
        exceptions.push(exception);
        this.setOption('Exceptions', exceptions.toString());
        return true;
      }
      return false;
    }

    public isException(url: string): boolean {
      if (url !== null) {
        var exceptions = this.getOption('Exceptions');

        for (var i = 0; i < exceptions.length; i++) {
          var regExp = new RegExp(exceptions[i]);

          if (regExp.test(url)) {
            return true;
          }
        }
      }
      return false;
    }

    public setEnabledBadge() {
      var badgeText = (!this.getOption('Enabled') ? Utils.i18n('browserActions_offBadge') : "");
      chrome.browserAction.setBadgeText({
        text: badgeText
      });
    }

    public setOption(optionName: string, value: any) {
      localStorage[this.fullOptionName(optionName)] = value;

      if (optionName.toLowerCase() === 'enabled') {
        this.setEnabledBadge();
      }
    }
  }
}
