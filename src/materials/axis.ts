import { drag } from 'd3-drag';
import { forceSimulation } from 'd3-force';
import { customEvent, event, mouse, select } from 'd3-selection';
import BaseCanvas from '../core/canvas';
import { CanvasSize } from '../declare';
import { setStrokeStyle } from '../utils/util';

interface AxisOffset extends Object {
  readonly x?: number;
  readonly y?: number;
}
export interface ChartSize extends CanvasSize {
  readonly height: number;
  readonly width: number;
}

interface StrokeStyle {
  color?: string;
  lineWidth?: number;
}

interface AxisOptions extends Object {
  readonly direction: string;
  chartSize: ChartSize;
  offset?: AxisOffset;
  strokeStyle?: StrokeStyle;
  length: number;
}

class Axis extends BaseCanvas {

  protected canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ruler: any;
  private options: AxisOptions;
  private domain: any[];
  private defaultStrokeStyle: StrokeStyle = {
    lineWidth: 1,
    color: 'black'
  };

  constructor (canvas: HTMLCanvasElement, ruler: any, domain: any[], options: AxisOptions) {
    super(canvas);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ruler = ruler;
    this.domain = domain;
    this.options = options;
    this.init();
  }

  public drawScale (strokeStyle?: StrokeStyle) {
    this.ctx.beginPath();
    if (this.options.direction === 'verticle') {
      this.domain.forEach((d) => {
        this.ctx.moveTo(this.ruler(d) + this.options.offset.x, this.options.chartSize.height);
        this.ctx.lineTo(this.ruler(d) + this.options.offset.x, this.options.chartSize.height - this.options.length);
      });
    } else if (this.options.direction === 'align') {
      this.domain.forEach((d) => {
        this.ctx.moveTo(0, this.ruler(d));
        this.ctx.lineTo(0 + this.options.length, this.ruler(d));
      });
    }
    setStrokeStyle(this.ctx, {...this.defaultStrokeStyle, ...strokeStyle});
    this.ctx.stroke();
  }

  public drawLine (strokeStyle?: StrokeStyle) {
    this.ctx.beginPath();
    if (this.options.direction === 'verticle') {
      this.ctx.moveTo(0, this.options.chartSize.height);
      this.ctx.lineTo(this.options.chartSize.width, this.options.chartSize.height);
    } else if (this.options.direction === 'align') {
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, this.options.chartSize.height);
    }
    setStrokeStyle(this.ctx, {...this.defaultStrokeStyle, ...strokeStyle});
    this.ctx.stroke();
  }

  private init () {
    this.bindEvent();
  }

  private bindEvent () {
    const simulation = forceSimulation([{
      x: 0,
      y: 0,
      index: 0
    }, {
      x: 100,
      y: 100,
      index: 1
    }]);
    select('canvas').on('mousemove', () => {
      const pos = mouse(this.canvas);
      console.log(simulation.find(pos[0], pos[1]));
    });
  }

}

export default Axis;
