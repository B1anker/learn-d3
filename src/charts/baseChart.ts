import { select } from 'd3-selection';
import Root from '../charts/root';
import { Boundary } from '../define/interface';
import { MySelection } from '../define/type';

export interface VisibleSize {
  width: number;
  height: number;
}

export interface BaseChartSize {
  width: number;
  height: number;
}

export interface BaseChartOptions {
  selector: string;
  size: BaseChartSize;
  boundary?: Boundary;
}

export default class BaseChart extends Root {
  public boundary: Boundary = {
    top: 30,
    left: 30,
    bottom: 30,
    right: 30
  };
  public baseChartSize: BaseChartSize;
  public baseChart: MySelection;
  public eventContainer: MySelection;
  public visibleSize: VisibleSize;
  public width: number;
  public height: number;
  protected options: BaseChartOptions;
  protected selection: MySelection;

  constructor (options: BaseChartOptions) {
    super();
    this.options = options;
    this.init();
  }

  private init () {
    this.baseChartSize = this.options.size;
    Object.assign(this.boundary, this.options.boundary);
    this.width = this.options.size.width;
    this.height = this.options.size.height;
    this.visibleSize = {
      width: this.baseChartSize.width - this.boundary.left - this.boundary.right,
      height: this.baseChartSize.height - this.boundary.top - this.boundary.bottom
    };
    Object.assign(this.boundary, this.options.boundary);
    this.baseChart = select(this.options.selector)
      .attr('width', this.baseChartSize.width)
      .attr('height', this.baseChartSize.height);
    this.selection = this.baseChart;
    this.eventContainer = this.baseChart.append('rect')
      .attr('class', 'event-container')
      .attr('x', this.boundary.left)
      .attr('y', this.boundary.top)
      .attr('width', this.visibleSize.width)
      .attr('height', this.visibleSize.height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');
  }
}
