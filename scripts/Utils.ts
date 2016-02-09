module Utils {
  export function _(elementId): any {
    return document.getElementById(elementId);
  }

  export function i18n(messageName: string, substitutions?: any): string {
    return chrome.i18n.getMessage(messageName, substitutions)
  }
}
