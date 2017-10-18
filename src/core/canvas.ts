class BaseCanvas {
  protected canvas: HTMLCanvasElement;
  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public on (type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void {
    this.canvas.addEventListener(type, listener, useCapture);
  }
}

export default BaseCanvas;
