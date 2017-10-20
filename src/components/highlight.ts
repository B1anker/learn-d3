import { BaseChartSize } from '../charts/baseChart';
import Root from '../charts/root';
import { MySelection } from '../define/type';

export type HighlightTpye = 'dash' | 'default';

export interface HighlightOptions {
  type: HighlightTpye;
  lineChart: any;
}

export default class Highlight extends Root {
  protected selection: MySelection;
  private container: any;
  private options: HighlightOptions;

  constructor (options: HighlightOptions) {
    super();
    this.options = options;
    this.init();
    this.draw();
  }

  private init () {
    this.container = this.options.lineChart;
  }

  private draw () {
    this.selection = this.container.baseChart.append('line')
      .attr('class', 'highlight')
      .style('stroke', '#cccccc')
      .style('stroke-dasharray', '2, 2')
      .style('stroke-width', 1)
      .style('visibility', 'hidden')
      .attr('x1', this.container.visibleSize.width)
      .attr('x2', this.container.visibleSize.width)
      .attr('y1', this.container.boundary.top)
      .attr('y2', this.container.height - this.container.boundary.top);
  }
}
