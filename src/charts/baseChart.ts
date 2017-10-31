import Root from '@/charts/root';
import { BaseChartOptions, BaseChartSize, Boundary, VisibleSize } from '@/define/interface';
import { MySelection } from '@/define/type';
import generateId from '@/utils/id';
import { select } from 'd3-selection';
/*
 * 基本图表
 */
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
  public id: string;
  protected options: BaseChartOptions;
  protected selection: MySelection;

  constructor (options: BaseChartOptions) {
    super();
    this.options = {
      ...options, ...{
        selector: 'h3-container'
      }
    };
    this.initBaseChart();
  }

  public get width (): number {
    return this.options.size.width;
  }
  public get height (): number {
    return this.options.size.height;
  }

  private initBaseChart () {
    this.drawStage();
    this.drawEventContainer();
  }

  // 绘制平台
  private drawStage () {
    this.baseChartSize = this.options.size;
    Object.assign(this.boundary, this.options.boundary);
    this.visibleSize = {
      width: this.width - this.boundary.left - this.boundary.right,
      height: this.height - this.boundary.top - this.boundary.bottom
    };
    Object.assign(this.boundary, this.options.boundary);
    this.id = generateId();
    this.baseChart = select('body')
      .append('div')
      .attr('class', `${this.options.selector.replace(/[\.#]/, '')} root`)
      .append('svg')
      .attr('class', this.id)
      .attr('width', this.width)
      .attr('height', this.height);
    this.selection = this.baseChart;
  }

  // 添加一个盖满图表的容器，用于监听mousemove事件
  private drawEventContainer () {
    if (!this.options.isDrawEventContainer) {
      return;
    }
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
