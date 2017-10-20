import { max } from 'd3-array';
import { ScaleLinear, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import Root from '../charts/root';
import { Boundary } from '../define/interface';
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
  series: any;
  baseChartOptions: any;
  scale?: Scale;
}

class Line {
  public xScale: ScaleLinear<number, number>;
  public yScale: ScaleLinear<number, number>;
  protected options: LineOptions;
  private baseChart: MySelection;

  constructor (options: LineOptions) {
    this.options = options;
    this.baseChart = this.options.baseChartOptions.el;
    this.init();
    this.draw();
  }

  private init () {
    const width: number = this.options.baseChartOptions.size.width;
    const height: number = this.options.baseChartOptions.size.height;
    this.xScale = scaleLinear().domain([2000, 2013])
      .range([0, width - this.options.baseChartOptions.boundary.left - this.options.baseChartOptions.boundary.right]);

    let rangeMax: number = 0;

    this.options.series.forEach((serie) => {
      const cur: number = parseInt(max(serie.data), 10);
      if (cur > rangeMax) {
        rangeMax = cur;
      }
    });

    this.yScale  = scaleLinear().domain([0, rangeMax * 1.1])
      .range([height - this.options.baseChartOptions.boundary.top - this.options.baseChartOptions.boundary.bottom, 0]);

  }

  private draw () {
    const domian = this.options.domain;
    const input = [...Array(this.options.series.length).fill(0)].map((data, index) => {
      return [...domian].map((innerData, innerIndex) => {
        return [innerData, this.options.series[index].data[innerIndex]];
      }) as Array<[number, number]>;
    });

    this.baseChart.selectAll('path')
      .data(input)
      .enter()
      .append('path')
      .attr('transform', `translate(${this.options.baseChartOptions.boundary.left}, ${this.options.baseChartOptions.boundary.right})`)
      .attr('d', (d, i) => {
        return this.linePath()(d);
      })
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', (d, i) => {
        return this.options.series[i].lineStyle.color;
      });
  }

  private linePath () {
    return line().x((d) => {
      return Math.round(this.xScale(d[0]));
    }).y((d) => {
      return Math.round(this.yScale(d[1]));
    });
  }
}

export default Line;
