module Options {
  export interface IOptions {
    enabled: boolean,
    zoomMode: ZoomMode,
    maximumZoomAllowed: number,
    minimumZoomAllowed: number,
    exceptions: string[]
  }
}
