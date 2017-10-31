import Coordinate from '@/components/coordinate';
import Legend from '@/components/legend';
import Line from '@/components/line';
import Snapline from '@/components/snapline';
import Tooltip from '@/components/tooltip';
import Observe from '@/core/observe';
import { BaseChartOptions, LineChartExternal, LineSeriesItem } from '@/define/interface';
import { MySelection, ScaleType } from '@/define/type';
import { bisector } from 'd3-array';
import { ContainerElement, event, mouse, select, selectAll } from 'd3-selection';
import * as transition from 'd3-transition';
import BaseChart from './baseChart';

interface BaseScale {
  type?: ScaleType;
  domain: any[];
  range: any[];
}

interface Scale {
  x?: BaseScale;
  y?: BaseScale;
}

interface LineChartOptions extends LineChartExternal {
  scale?: Scale;
  xAxis: any;
  series: LineSeriesItem[];
}

/*
 * 折线图
 */
class LineChart extends BaseChart {
  protected options: LineChartOptions;
  private lineArray: any[] = [];
  private snapline: Snapline;
  private line: Line;
  private tooltip: Tooltip;
  private legend: Legend;
  private lastIndex: number = 0;
  private position: any = [0, 0];
  private moveTimer: any = null;
  private observe: Observe;
  private state: any;

  constructor (options: LineChartExternal) {
    super(options);
    this.options = options;
    this.init();
  }

  private init () {
    this.observe = new Observe({
      data: {
        mousePosition: [0, 0],
        index: this.options.xAxis.data.length - 1,
        mouseState: 'out',
        legend: [...this.options.legend]
      },
      verbose: false
    });
    this.state = this.observe.get();
    this.drawLine();
    this.drawAxis();
    this.drawSnapline();
    this.drawTooltip();
    this.drawLegend();
    this.bindEvents();
    this.addWatcher();
  }

  private get index () {
    return this.calculatePosition(this.options.xAxis.data, Math.round(this.line.xScale.invert(this.position[0] - this.boundary.left)));
  }

  private drawLine () {
    this.line = new Line({
      domain: this.options.xAxis.data,
      series: this.options.series,
      baseChartOptions: {
        el: this.baseChart,
        boundary: this.boundary,
        size: this.baseChartSize
      },
      legend: this.options.legend
    });
  }

  private drawAxis () {
    const x = new Coordinate({
      domain: [...Array(2013 - 2000 + 1).fill(0)].map((item, index) => index + 2000),
      baseChart: this.getSelection(),
      position: 'bottom',
      offset: {
        x: this.boundary.left,
        y: this.baseChartSize.height - this.boundary.bottom
      },
      className: 'axis',
      label: {
        color: 'black',
        size: 16,
        weight: 'lighter'
      },
      scale: this.line.xScale,
      tick: {
        color: 'red',
        count: 12
      }
    });

    const y = new Coordinate({
      domain: [...Array(14).fill(0)].map((d, i) => i + 2000),
      baseChart: this.getSelection(),
      position: 'left',
      offset: {
        x: this.boundary.left,
        y: this.boundary.top
      },
      className: 'axis',
      label: {
        color: 'black',
        size: 16,
        weight: 'lighter'
      },
      scale: this.line.yScale,
      tick: {
        color: 'red',
        count: 12
      }
    });
  }

  private drawSnapline () {
    this.snapline = new Snapline({
      lineChart: this,
      type: 'dash',
      xScale: this.line.xScale,
      xAxis: this.options.xAxis.data
    });
    // 把事件监听容器提到最上层
    this.eventContainer.raise();
  }

  private drawTooltip () {
    this.tooltip = new Tooltip({
      yName: [...this.options.series].map((serie) => {
        return serie.name;
      }),
      selector: this.options.selector,
      color: [...this.options.series].map((serie) => {
        return serie.lineStyle.color;
      }),
      legend: this.options.legend,
      type: 'axis',
      id: this.id,
      observe: this.observe,
      xAxis: this.options.xAxis.data,
      series: this.options.series
    });
  }

  private drawLegend () {
    this.legend = new Legend({
      data: this.options.legend,
      series: this.options.series,
      boundary: this.boundary,
      id: this.id,
      observe: this.observe
    });
  }

  // 绑定鼠标事件
  private bindEvents () {
    this.eventContainer.on('mouseover', () => {
      mouse(this.eventContainer.node() as ContainerElement);
      this.state.mouseState = 'over';
    }).on('mouseout', () => {
      if (event.relatedTarget && event.relatedTarget.nodeName !== 'svg') {
        return;
      }
      this.state.mouseState = 'out';
    }).on('mousemove', this.mouseMoveControler.bind(this));
  }

  // 鼠标移动时，改变state相应的值，以驱动observe的watcher运行
  private mouseMoveControler () {
    this.position = mouse(this.eventContainer.node() as ContainerElement);
    this.state.mousePosition = this.position;
    // 节流，提高性能
    if (this.moveTimer === null) {
      this.moveTimer = setTimeout(() => {
        clearTimeout(this.moveTimer);
        this.moveTimer = null;
        if (this.index === this.state.index) {
          return;
        }
        this.state.index = this.index;
      }, 200);
    }
  }

  // 计算当前鼠标所对应的横坐标的下标
  private calculatePosition (data, x0) {
    const bisect = bisector((d) => {
      return d;
    }).left;
    return bisect(data, x0);
  }

  // 添加属性观察
  private addWatcher () {
    this.observe.push(this.line.watcher);
    this.observe.push(this.tooltip.watcher);
    this.observe.push(this.snapline.watcher);
  }
}

export default LineChart;
