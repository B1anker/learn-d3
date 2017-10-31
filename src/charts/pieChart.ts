import Legend from '@/components/legend-pie';
import Tooltip from '@/components/tooltip';
import Observe from '@/core/observe';
import { Boundary, PieChartExternal, PieSeriesItem } from '@/define/interface';
import { MySelection } from '@/define/type';
import lightColor from '@/utils/lightColor';
import { ContainerElement, event, mouse, select, selectAll } from 'd3-selection';
import { arc, Arc, DefaultArcObject, pie } from 'd3-shape';
import BaseChart from './baseChart';

interface PieData extends DefaultArcObject {
  data: {
    name: string;
    value: number;
    color?: string;
  };
}

/*
 * 饼图
 */
export default class PieChart extends BaseChart {
  protected options: PieChartExternal;
  private arcs: MySelection;
  private arc: Arc<any, DefaultArcObject> = arc();
  private observe: Observe;
  private tooltip: Tooltip;
  private legend: Legend;

  constructor (options: PieChartExternal) {
    super(options);
    this.options = options;
    this.observe = new Observe({
      data: {
        mousePosition: [0, 0],
        mouseState: 'out',
        itemName: '',
        pieLegend: (this.options.series[0].data as PieSeriesItem[]).map((d) => d.name)
      }
    });
    this.init();
  }
  
  private init () {
    this.initData();
    this.draw();
    this.bindEvents();
    this.addWatcher();
  }

  private initData () {
    this.options.series.map((serie) => {
      if (typeof serie.data === 'function') {
        serie.data = serie.data() as PieSeriesItem[];
      }
      return serie;
    });
  }

  private get state (): any {
    return this.observe.get();
  }

  private draw () {
    this.drawPie();
    this.drawText();
    this.drawLine();
    this.drawTooltip();
    this.drawLegend();
  }

  private get serie () {
    return this.options.series[0];
  }

  private get radius (): number {
    return this.convertStringToNumber(this.serie.radius);
  }

  private get data () {
    return [...this.serie.data as PieSeriesItem[]].filter((d, i) => {
      if (!~this.state.pieLegend.indexOf(d.name)) {
        return false;
      }
      return true;
    });
  }

  private get pieData (): PieData[] {
    return pie().value((d) => {
      return (d as any).value;
    })(this.data as any).map((d) => {
      (d as any).outerRadius = this.outerRadius;
      (d as any).innerRadius = this.innerRadius;
      return d;
    }) as any;
  }

  private get position (): number[] {
    return this.serie.center.map(this.convertStringToNumber);
  }

  private get outerRadius (): number {
    return this.baseChartSize.width / 2 * this.radius;
  }

  private get innerRadius (): number {
    return 0;
  }

  private convertStringToNumber (str: string) {
    return parseFloat(str) / 100;
  }

  private drawPie () {
    this.baseChart
      .select('.pie')
      .remove();
    this.arcs = this.baseChart
      .append('g')
      .classed('pie', true)
      .attr('transform', `translate(${this.baseChartSize.width * this.position[0]}, ${this.baseChartSize.height * this.position[1]})`)
      .selectAll('g');
    this.arcs
      .data<PieData>(this.pieData)
      .enter()
      .append('path')
      .attr('class', (d) => {
        return `${d.data.name} arc`;
      })
      .attr('d', (d) => {
        return this.arc(d);
      })
      .attr('fill', (d) => {
        return lightColor((d as any).data.color, 0);
      });
  }

  private drawText () {
    this.arcs
      .data<PieData>(this.pieData)
      .enter()
      .append('text')
      .attr('transform', (d) => {
        const x = this.arc.centroid(d)[0] * 2.5;
        const y = this.arc.centroid(d)[1] * 2.5;
        return `translate(${x}, ${y})`;
      })
      .attr('text-anchor', 'middle')
      .attr('stroke', (d) => {
        return d.data.color;
      })
      .attr('stroke-width', 0.5)
      .text((d) => {
        return (d).data.name;
      });
  }

  private drawLine () {
    this.arcs
      .data<PieData>(this.pieData)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        return (d as any).data.color;
      })
      .attr('x1', (d) => {
        return this.arc.centroid(d)[0] * 2;
      })
      .attr('y1', (d) => {
        return this.arc.centroid(d)[1] * 2;
      })
      .attr('x2', (d) => {
        return this.arc.centroid(d)[0] * 2.25;
      })
      .attr('y2', (d) => {
        return this.arc.centroid(d)[1] * 2.25;
      });
  }

  private drawTooltip () {
    this.tooltip = new Tooltip({
      selector: this.options.selector,
      type: 'item',
      id: this.id,
      observe: this.observe,
      series: this.options.series,
      formatter: this.options.tooltip.formatter
    });
  }

  private drawLegend () {
    this.legend = new Legend({
      data: this.serie.data,
      baseChartSize: this.baseChartSize,
      id: this.id,
      offset: {
        left: this.options.legend.offset.left,
        top: this.options.legend.offset.top
      }
    });
    this.legend.changeLegend(this.state.pieLegend);
    const self = this;
    this.observe.push({
      pieLegend (newVal) {
        self.refresh();
      }
    });
  }

  private refresh () {
    this.baseChart.select('.pie').html('');
    this.drawPie();
    this.drawText();
    this.drawLine();
    this.drawTooltip();
    this.bindEvents();
    this.addWatcher();
  }

  private bindEvents () {
    this.choose();
  }

  private choose () {
    const self = this;
    select(`.${this.id}`).on('mouseover', function () {
      if (event.relatedTarget && event.relatedTarget.nodeName === 'svg' && event.srcElement.nodeName === 'path') {
        self.state.mouseState = 'over';
        const el: MySelection = select(event.srcElement);
        el.attr('fill', (d) => {
          return lightColor((d as any).data.color, 4);
        });
      } else if (event.relatedTarget && event.relatedTarget.nodeName === 'path' && event.srcElement.nodeName === 'svg') {
        self.state.mouseState = 'out';
        const el: MySelection = select(event.relatedTarget);
        el.attr('fill', (d) => {
          return lightColor((d as any).data.color, -4);
        });
      } else if (event.relatedTarget && event.relatedTarget.nodeName === 'path' && event.srcElement.nodeName === 'path') {
        self.state.mouseState = 'over';
        const to: MySelection = select(event.srcElement);
        const from: MySelection = select(event.relatedTarget);
        from.attr('fill', (d) => {
          return lightColor((d as any).data.color, -4);
        });
        to.attr('fill', (d) => {
          return lightColor((d as any).data.color, 4);
        });
      }
    }).on('mousemove', function () {
      if (event.target.nodeName === 'path') {
        self.move(this);
      }
    });
  }

  private removeEvent () {
    select(`.${this.id}`).on('mousemove', null).on('mouseover', null);
  }

  private move (ctx) {
    this.state.mousePosition = mouse(ctx);
    this.state.itemName = event.target.className.baseVal.replace(' arc', '');
  }

  private addWatcher () {
    this.observe.push(this.tooltip.watcher);
  }
}
