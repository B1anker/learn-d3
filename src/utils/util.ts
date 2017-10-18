export function setStrokeStyle (ctx: CanvasRenderingContext2D, options: any) {
  Object.keys(options).forEach((key) => {
    switch (key) {
      case 'color':
        ctx.strokeStyle = options[key];
        break;
      case 'lineWidth':
        ctx.lineWidth = options[key];
        break;
    }
  });
}
