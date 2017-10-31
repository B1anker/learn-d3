import Root from '@/charts/root';
import Observe from '@/core/observe';
import { Boundary, LineSeriesItem } from '@/define/interface';
import { MySelection, ScaleType } from '@/define/type';
import { max } from 'd3-array';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { curveNatural, line } from 'd3-shape';

interface BaseScale {
  type: ScaleType;
  domain: any[];
  range: any[];
}

interface Scale {
  x?: BaseScale;
  y?: BaseScale;
}

export type LineType = 'broken' | 'curve';

interface LineOptions {
  domain: any;
  series: LineSeriesItem[];
  baseChartOptions: any;
  scale?: Scale;
  legend: string[] | number[];
}

/*
 * 线条，现在为折线，以后可增加曲线
 */
class Line extends Root {
  public xScale: ScaleLinear<number, number>;
  public yScale: ScaleLinear<number, number>;
  public linePathGenerator: any;
  public watcher: any;
  protected options: LineOptions;
  protected selection: MySelection;
  private baseChart: MySelection;
  private width: number;
  private height: number;
  private boundary: Boundary;
  private domain: any[];
  private circles: MySelection;
  private observe: Observe;

  constructor (options: LineOptions) {
    super();
    this.options = options;
    this.init();
    this.draw();
    this.drawCircle();
  }

  public getCircles () {
    return this.baseChart.selectAll('.circle-wrap');
  }

  // 很多地方用到这个东西，可以用这个写法
  private get chartOptions () {
    return this.options.baseChartOptions;
  }

  private init () {
    this.watcher = {
      index: this.moveCircles.bind(this),
      legend: this.visibleControl.bind(this)
    };
    this.baseChart = this.chartOptions.el;
    this.width = this.chartOptions.size.width;
    this.height = this.chartOptions.size.height;
    this.boundary = this.chartOptions.boundary;
    this.xScale = scaleLinear().domain([2000, 2013])
      .range([0, this.width - this.boundary.left - this.boundary.right]);
    this.options.series.map((serie) => {
      if (typeof serie.data === 'function') {
        serie.data = serie.data();
      }
      return serie;
    });

    let rangeMax: number = 0;

    this.options.series.forEach((serie) => {
      const cur: number = parseInt(max(serie.data as string[]), 10);
      if (cur > rangeMax) {
        rangeMax = cur;
      }
    });

    this.yScale = scaleLinear().domain([0, rangeMax * 1.1])
      .range([this.height - this.chartOptions.boundary.top - this.chartOptions.boundary.bottom, 0]);
    this.linePathGenerator = line().x((d) => {
      return Math.round(this.xScale(d[0]));
    }).y((d) => {
      return Math.round(this.yScale(d[1]));
    });
  }

  private draw () {
    this.domain = this.options.domain;
    const input = [...Array(this.options.series.length).fill(0)].map((data, index) => {
      return [...this.domain].map((innerData, innerIndex) => {
        return [innerData, this.options.series[index].data[innerIndex]];
      }) as Array<[number, number]>;
    });

    this.selection = this.baseChart.selectAll('path')
      .data(input)
      .enter()
      .append('path')
      .attr('transform', `translate(${this.chartOptions.boundary.left}, ${this.chartOptions.boundary.right})`)
      .attr('d', (d, i) => {
        return this.linePathGenerator(d);
      })
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', (d, i) => {
        return this.options.series[i].lineStyle.color;
      });
  }

  private drawCircle () {
    this.circles = this.baseChart.selectAll('.circle-wrap')
      .data(this.options.series)
      .enter()
      .append('g')
      .attr('class', 'circle-wrap')
      .attr('transform', (d) => {
        return `translate(${this.width - this.boundary.right}, ${this.yScale(d.data[d.data.length - 1]) + this.boundary.top})`;
      })
      .append('circle')
      .attr('class', 'hover-dot')
      .attr('fill', (d) => {
        return d.lineStyle.color;
      })
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 5);
  }

  private moveCircles (newVal) {
    const yPos = [...this.options.series].map((serie) => {
      return serie.data[newVal];
    });
    const xPoint = this.xScale(this.options.domain[newVal]) + this.boundary.left;
    this.baseChart.selectAll('.circle-wrap')
      .data(this.options.series)
      .transition()
      .attr('transform', (d, i) => {
        return `translate(${xPoint}, ${this.yScale(yPos[i]) + this.boundary.top})`;
      });
  }

  // 根据legend变化来控制线条和圆点的显示隐藏
  private visibleControl (newVal) {
    const lines: MySelection = this.baseChart.selectAll('path');
    const circles: MySelection = this.baseChart.selectAll('.circle-wrap');
    (this.options.legend as any).forEach((val, index) => {
      if (newVal.indexOf(val) === -1) {
        lines.filter((d, k) => {
          return k === index;
        }).classed('h3-hidden', true);
        circles.filter((d, k) => {
          return k === index;
        }).classed('h3-hidden', true);
      } else {
        lines.filter((d, k) => {
          return k === index;
        }).classed('h3-hidden', false);
        circles.filter((d, k) => {
          return k === index;
        }).classed('h3-hidden', false);
      }
    });
  }
}

export default Line;
