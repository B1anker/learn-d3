import Root from '@/charts/root';
import { BaseChartSize, PieSeriesItem } from '@/define/interface';
import { MySelection } from '@/define/type';
import { select } from 'd3-selection';

interface LegendOptions {
  data: PieSeriesItem[] | (() => PieSeriesItem[]);
  id: string;
  offset: {
    left: string;
    top: string;
  };
  baseChartSize: BaseChartSize;
  gap?: number;
  icon?: {
    size: {
      width: number;
      height: number;
    }
  };
}

export default class Legend extends Root {
  private options: LegendOptions;
  private gs: MySelection;
  private default = {
    icon: {
      size: {
        width: 24,
        height: 14
      }
    },
    gap: 10
  };

  constructor (options: LegendOptions) {
    super();
    this.options = { ...options, ...this.default } as any;
    this.init();
  }
  
  public changeLegend (legend) {
    const dictionary = {};
    const self = this;
    [...(this.options.data) as PieSeriesItem[]].forEach((d, index) => {
      dictionary[d.name] = index;
    });
    this.gs.on('click', function () {
      const el: MySelection = select(this);
      const index = self.store.indexOf(el.attr('class').replace(' legend-disActive', ''));
      if (~el.attr('class').search('legend-disActive')) {
        el.classed('legend-disActive', false);
        const name = el.attr('class').replace(' legend-disActive', '');
        legend.splice(dictionary[name], 0, name);
      } else {
        legend.splice(index, 1);
        el.classed('legend-disActive', true);
      }
    });
  }

  private get store () {
    return (this.options.data as PieSeriesItem[]).map((d) => d.name);
  }

  private get iconSize () {
    return this.options.icon.size;
  }
  
  private get gap () {
    return this.options.gap;
  }

  private get width () {
    return this.options.baseChartSize.width;
  }

  private get height () {
    return this.options.baseChartSize.height;
  }

  private get top () {
    return parseFloat(this.options.offset.top) / 100 * this.height;
  }
  
  private get left () {
    return parseFloat(this.options.offset.left) / 100 * this.width;
  }

  private init () {
    this.draw();
    // this.bindEvend();
  }

  private draw () {
    this.drawContainer();
    this.drawIcon();
    this.drawText();
  }

  private drawContainer () {
    this.gs = select(`.${this.options.id}`).append('g')
      .attr('transform', `translate(${this.left}, ${this.top})`)
      .selectAll('g')
      .data<PieSeriesItem>(this.options.data as PieSeriesItem[])
      .enter()
      .append('g')
      .attr('class', (d) => {
        return `${d.name}`;
      })
      .attr('stroke', (d) => {
        return (d as any).color;
      })
      .attr('cursor', 'pointer');
  }
  
  private drawIcon () {
    this.gs.append('rect')
      .attr('width', this.iconSize.width)
      .attr('height', this.iconSize.height)
      .attr('fill', (d) => {        
        return (d as any).color;
      })
      .attr('y', (d, i) => {
        return i * (this.iconSize.height + this.gap);
      })
      .attr('rx', 3);
  }

  private drawText () {
    this.gs.append('text')
      .attr('alignment-baseline', 'before-edge')
      .attr('x', 35)
      .attr('y', (d, i) => {
        return i * (this.iconSize.height + this.gap);
      })
      .attr('dy', '-.32em')
      .html((d) => (d as any).name);
  }
}
