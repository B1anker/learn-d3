import { max } from 'd3-array';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { curveNatural, line } from 'd3-shape';
import Root from '../charts/root';
import { Boundary, LineSeriesItem } from '../define/interface';
import { MySelection, ScaleType } from '../define/type';

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
}

class Line {
  public xScale: ScaleLinear<number, number>;
  public yScale: ScaleLinear<number, number>;
  public linePathGenerator: any;
  protected options: LineOptions;
  private baseChart: MySelection;
  private width: number;
  private height: number;
  private boundary: Boundary;
  private domian: any[];
  private circles: MySelection;

  constructor (options: LineOptions) {
    this.options = options;
    this.baseChart = this.options.baseChartOptions.el;
    this.init();
    this.draw();
    this.drawCircle();
  }

  public getCircles () {
    return this.circles;
  }

  private init () {
    this.width = this.options.baseChartOptions.size.width;
    this.height = this.options.baseChartOptions.size.height;
    this.boundary = this.options.baseChartOptions.boundary;
    this.xScale = scaleLinear().domain([2000, 2013])
      .range([0, this.width - this.boundary.left - this.boundary.right]);

    let rangeMax: number = 0;

    this.options.series.forEach((serie) => {
      const cur: number = parseInt(max(serie.data), 10);
      if (cur > rangeMax) {
        rangeMax = cur;
      }
    });

    this.yScale  = scaleLinear().domain([0, rangeMax * 1.1])
      .range([this.height - this.options.baseChartOptions.boundary.top - this.options.baseChartOptions.boundary.bottom, 0]);
    this.linePathGenerator = line().x((d) => {
      return Math.round(this.xScale(d[0]));
    }).y((d) => {
      return Math.round(this.yScale(d[1]));
    }).curve(curveNatural);

  }

  private draw () {
    this.domian = this.options.domain;
    const input = [...Array(this.options.series.length).fill(0)].map((data, index) => {
      return [...this.domian].map((innerData, innerIndex) => {
        return [innerData, this.options.series[index].data[innerIndex]];
      }) as Array<[number, number]>;
    });

    this.baseChart.selectAll('path')
      .data(input)
      .enter()
      .append('path')
      .attr('transform', `translate(${this.options.baseChartOptions.boundary.left}, ${this.options.baseChartOptions.boundary.right})`)
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
    this.circles = this.baseChart.selectAll('g')
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
}

export default Line;
