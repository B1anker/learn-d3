import Root from '@/charts/root';
import { BaseChartSize } from '@/define/interface';
import { MySelection } from '@/define/type';

export type SnaplineTpye = 'dash' | 'default';

export interface SnaplineOptions {
  type: SnaplineTpye;
  lineChart: any;
  xScale: any;
  xAxis: any;
}

/*
 * 对齐线
 */
export default class Snapline extends Root {
  public watcher: any;
  protected selection: MySelection;
  private container: any;
  private options: SnaplineOptions;

  constructor (options: SnaplineOptions) {
    super();
    this.options = options;
    this.init();
    this.draw();
  }

  private init () {
    this.container = this.options.lineChart;
    this.watcher = {
      index: this.move.bind(this),
      mouseState: this.visible.bind(this)
    };
  }

  private draw () {
    this.selection = this.container.baseChart.append('line')
      .attr('class', 'highlight h3-hidden')
      .style('stroke', '#cccccc')
      .style('stroke-dasharray', '2, 2')
      .style('stroke-width', 1)
      .attr('x1', this.container.visibleSize.width)
      .attr('x2', this.container.visibleSize.width)
      .attr('y1', this.container.boundary.top)
      .attr('y2', this.container.height - this.container.boundary.top);
  }

  private move (newVal) {
    const xPoint = this.options.xScale(this.options.xAxis[newVal]) + this.container.boundary.left;
    this.selection.transition()
      .attr('x1', xPoint)
      .attr('x2', xPoint);
  }

  private visible (newVal, oldVal, state) {
    if (newVal === 'over') {
      this.selection.classed('h3-hidden', false);
    } else {
      this.selection.classed('h3-hidden', true);
    }
  }
}
