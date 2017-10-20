import { ContainerElement, mouse } from 'd3-selection';
import Coordinate from '../components/coordinate';
import Highlight from '../components/highlight';
import Line from '../components/line';
import { MySelection, ScaleType } from '../define/type';
import BaseChart, { BaseChartOptions } from './baseChart';

interface BaseScale {
  type?: ScaleType;
  domain: any[];
  range: any[];
}

interface Scale {
  x?: BaseScale;
  y?: BaseScale;
}

interface LineChartOptions extends BaseChartOptions {
  scale?: Scale;
  xAxis: any;
  series: any;
}

class LineChart extends BaseChart  {
  protected options: LineChartOptions;
  private line: any;
  private lineArray: any[] = [];
  private highlight: MySelection;

  constructor (options: LineChartOptions) {
    super(options);
    this.options = options;
    this.drawLine();
    this.drawAxis();
    this.drawHighlight();
    this.bindEvents();
  }

  private drawLine () {
    this.line = new Line({
      domain: this.options.xAxis.data,
      series: this.options.series,
      baseChartOptions: {
        el: this.baseChart,
        boundary: this.boundary,
        size: this.baseChartSize
      }
    });
  }

  private drawAxis () {
    const x = new Coordinate({
      domain: [...Array(2013 - 2000 + 1).fill(0)].map((item, index) => index + 2000),
      baseChart: this.baseChart,
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
      baseChart: this.baseChart,
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

  private drawHighlight () {
    this.highlight = new Highlight({
      lineChart: this,
      type: 'dash'
    }).getSelection();
    this.eventContainer.raise();
  }

  private bindEvents () {
    this.eventContainer.on('mouseover', () => {
      this.highlight.style('visibility', 'visible');
    }).on('mouseout', () => {
      this.highlight.style('visibility', 'hidden');
    }).on('mousemove', this.mouseMoveControler.bind(this));
  }

  private mouseMoveControler () {
    const position = mouse(this.eventContainer.node() as ContainerElement);
    this.highlight.attr('x1', position[0])
      .attr('x2', position[0]);
  }
}

export default LineChart;
