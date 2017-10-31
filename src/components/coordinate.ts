import BaseChart from '@/charts/baseChart';
import { BaseChartSize } from '@/define/interface';
import { MultiParameter, MySelection, Weight } from '@/define/type';
import generateId from '@/utils/id';
import { Axis, axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { format } from 'd3-format';
import { ScaleLinear } from 'd3-scale';
import { EnterElement, select, Selection } from 'd3-selection';

interface Offset {
  x: number;
  y: number;
}

interface TickOptions {
  color?: string;
  length?: number;
  count?: number;
  visible?: boolean;
  inside?: boolean;
  format?: string;
  filter?: any[];
}

interface LabelOptions {
  color?: MultiParameter<string>;
  size?: number;
  weight?: Weight;
}

interface Line {
  color?: MultiParameter<string>;
  weight?: Weight;
}

interface CoordinateOptions {
  domain: any[];
  baseChart: MySelection;
  position: string;
  offset: Offset;
  scale: ScaleLinear<number, number>;
  tick?: TickOptions;
  label?: LabelOptions;
  line?: Line;
  className?: string;
}

/*
 * 坐标
 */
class Coordinate {
  private id: number;
  private options: CoordinateOptions;
  private generator: Axis<number | {valueOf (): number}>;

  private tickOptions: TickOptions;
  private defaultTick: TickOptions = {
    color: 'black',
    length: 8,
    visible: true,
    inside: false,
    format: 'd',
    count: 5,
    filter: []
  };

  private labelOptions: LabelOptions;
  private defaultLabel: LabelOptions = {
    color: 'black',
    size: 10
  };

  constructor (options: CoordinateOptions) {
    this.options = options;
    this.init();
    this.draw();
  }

  private combineOptionsAndDefault () {
    this.tickOptions = {...this.defaultTick, ...this.options.tick};
    this.labelOptions = {...this.defaultLabel, ...this.options.label};
  }

  private init () {
    this.combineOptionsAndDefault();
    this.id = generateId();
    switch (this.options.position) {
      case 'bottom':
        this.generator = axisBottom(this.options.scale);
        break;
      case 'right':
        this.generator = axisRight(this.options.scale);
        break;
      case 'left':
        this.generator = axisLeft(this.options.scale);
        break;
      case 'top':
        this.generator = axisTop(this.options.scale);
        break;
    }
    this.generator.ticks(this.tickOptions.count)
      .tickFormat(format(this.tickOptions.format))
      .tickSize(this.tickOptions.length);
    if (this.tickOptions.filter.length) {
      this.generator = this.generator
        .tickValues(this.tickOptions.filter);
    }
  }

  private draw () {
    const g = this.options.baseChart.append('g')
      .attr('class', () => {
        switch (this.options.position) {
          case 'bottom':
            return 'xAxis';
          case 'right':
            return 'yAxis';
          case 'left':
            return 'yAxis';
          case 'top':
            return 'xAxis';
        }
      })
      .attr('id', this.id)
      .attr('transform', `translate(${this.options.offset.x}, ${this.options.offset.y})`)
      .call(this.generator);
    if (this.options.className) {
      g.attr('class', `${g.attr('class')} ${this.options.className}`);
    }
    this.applyStyle(this.labelOptions.color);
  }

  private applyStyle (color: MultiParameter<string>) {
    const ticks: MySelection = select(`#${this.id}`)
      .selectAll('.tick');
    const text: MySelection = ticks.select('text');
    if (typeof color === 'function') {
      ticks.data([...Array(ticks.nodes().length).fill(0)].map((item, index) => index));
      text.style('stroke', color);
    } else if (typeof color === 'string') {
      text.style('stroke', color);
    }
  }
}

export default Coordinate;
