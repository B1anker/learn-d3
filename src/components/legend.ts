import Root from '@/charts/root';
import Observe from '@/core/observe';
import { Boundary, LineSeriesItem } from '@/define/interface';
import { MySelection } from '@/define/type';
import { select } from 'd3-selection';
import { arc } from 'd3-shape';
import '../styles/legend.scss';

interface LegendOptions {
  data: any;
  series: LineSeriesItem[];
  boundary: Boundary;
  id: string;
  observe: Observe;
}

/*
 * 图标
 */
export default class Legen extends Root {
  protected selection: MySelection;
  private options: LegendOptions;
  private observe: Observe;
  private state: any;

  constructor (options: LegendOptions) {
    super();
    this.options = options;
    this.observe = this.options.observe;
    this.state = this.observe.get();
    this.init();
  }

  private get store () {
    return this.state.legend;
  }

  private init () {
    this.draw();
    this.bindEvent();
  }

  private draw () {
    this.drawContainer();
    this.drawArc();
    this.drawText();
  }

  private drawContainer () {
    this.selection = select(`.${this.options.id}`)
      .append('g')
      .attr('transform', `translate(180, ${this.options.boundary.top / 2})`)
      .selectAll('g')
      .data(this.options.data)
      .enter()
      .append('g')
      .attr('class', (d) => {
        return `${d}`;
      })
      .attr('cursor', 'pointer')
      .attr('transform', (d, i) => {
        return `translate(${i * 80 + this.options.series[i].name.length * 5}, 0)`;
      });
  }

  private drawArc () {
    const arcPath = arc();
    this.selection.append('path')
      .attr('d', arcPath({
        innerRadius: 6,
        outerRadius: 8,
        startAngle: 0,
        endAngle: Math.PI * 2,
        padAngle: 3
      }))
      .attr('stroke', (d, i) => {
        return this.options.series[i].lineStyle.color;
      })
      .attr('stroke-width', '2px');
  }

  private drawText () {
    this.selection.append('text')
    .html((d, i) => {
      return this.options.series[i].name;
    })
    .attr('x', 15)
    .attr('y', 5);
  }

  // 点击对应legend改变state.legend的值，让tooltip或line监听到这个变化，从而控制显示隐藏
  private bindEvent () {
    const self = this;
    const dictionary = {};
    [...this.options.data].forEach((d, index) => {
      dictionary[d] = index;
    });
    this.selection.on('click', function (c, i) {
      const el = select(this);
      const index = self.store.indexOf(el.attr('class').replace(' legend-disActive', ''));
      if (!~el.attr('class').search('legend-disActive')) {
        self.state.legend.splice(index, 1);
        el.classed('legend-disActive', true);
      } else {
        const name = el.attr('class').replace(' legend-disActive', '');
        self.state.legend.splice(dictionary[name], 0, name);
        el.classed('legend-disActive', false);
      }
    });
  }
}
