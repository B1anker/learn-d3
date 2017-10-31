import Root from '@/charts/root';
import Observe from '@/core/observe';
import { MySelection } from '@/define/type';
import { select } from 'd3-selection';
import '../styles/tooltip.scss';

interface TooltipOptions {
  color?: string[];
  xAxis?: any[];
  yName?: string | any[];
  legend?: number[] | string[];
  selector: string;
  id: string;
  series: any[];
  type: 'axis' | 'item';
  observe: Observe;
  formatter?: string;
}

/*
 * 提示
 */
export default class Tooltip extends Root {
  public watcher: any;
  protected selection: MySelection;
  private options: TooltipOptions;
  private observe: Observe;
  private state: any;
  private itemIndex: number = 0;
  private dictionary = {
    a: 'title',
    b: 'name',
    c: 'value',
    d: 'rate'
  };

  constructor (options: TooltipOptions) {
    super();
    this.options = options;
    this.observe = this.options.observe;
    this.state = this.observe.get();
    this.init();
  }

  private init () {
    this.createElement();
    this.watcher = {
      mousePosition: this.move.bind(this),
      mouseState: this.visible.bind(this),
      legend: this.textControl.bind(this),
      itemName: this.changeItem.bind(this)
    };
  }

  private get itemSerie () {
    return this.options.series[0];
  }

  private get itemTitle () {
    return this.itemSerie.title;
  }

  private get itemValueAmount () {
    return this.itemSerie.data.reduce((prev, next) => {
      return prev + next.value;
    }, 0);
  }

  private get itemName () {
    return this.itemSerie.data[this.itemIndex].name;
  }

  private get itemValue () {
    return this.itemSerie.data[this.itemIndex].value;
  }

  private get itemRate () {
    return (this.itemValue / this.itemValueAmount * 100).toFixed(2);
  }

  private createElement () {
    if (this.options.type === 'axis') {
      this.createElementOfAxis();
    } else if (this.options.type === 'item') {
      this.createElementOfItem();
    }
  }

  private createElementOfAxis () {
    const tooltip = document.createElement('div');
    tooltip.className = 'h3-tooltip h3-hidden';
    tooltip.innerHTML = `<div class="title"></div><ul class="details">${this.createDetail(this.options.yName)}</ul>`;
    document.querySelector(`.${this.options.id}`).parentElement.appendChild(tooltip);
    this.selection = select(`.${this.options.id} + .h3-tooltip`);
  }

  private createDetail (detail: string | any[]) {
    if (typeof detail === 'string') {
      return `<li class="detail">
        <span class="point"></span>
        <span class="name">${detail}: </span>
        <span class="value"></span>
      </li>`;
    } else {
      return [...detail].map((d, i) => {
        return `<li class="detail"><span class="point" style="background-color: ${this.options.color[i]}"></span><span class="name">${d}: </span><span class="value"></span></li>`;
      }).join('');
    }
  }

  private visible (newVal) {
    if (newVal === 'over') {
      this.selection.style('transform', `translate(${this.state.mousePosition[0] + 20}px, ${this.state.mousePosition[1] + 20}px)`);
      setTimeout(() => {
        this.selection.classed('h3-hidden', false);
      }, 100);
    } else {
      this.selection.classed('h3-hidden', true);
    }
  }

  private createElementOfItem () {
    const prev = document.querySelector(`.${this.options.id} ~ .h3-tooltip`);
    prev && prev.parentNode.removeChild(prev);

    const tooltip = document.createElement('div');
    tooltip.className = 'h3-tooltip h3-hidden';
    tooltip.innerHTML = this.options.formatter.replace(/{(\w)}/g, ($1, $2) => {
      switch (this.dictionary[$2]) {
        case 'title':
          return this.itemTitle;
        case 'name':
          return this.itemName;
        case 'value':
          return this.itemValue;
        case 'rate':
          return this.itemRate;
      }
    });
    document.querySelector(`.${this.options.id}`).parentElement.appendChild(tooltip);
    this.selection = select(`.${this.options.id} + .h3-tooltip`);
  }

  // tooltip跟着鼠标移动
  private move (newVal) {
    if (this.options.type === 'axis') {
      this.selection.select('.title')
        .html(this.options.xAxis[this.state.index]);
      this.selection.selectAll('.value')
        .data(this.options.series)
        .html((d, i) => {
          return d.data[this.state.index];
        });
      this.selection.transition()
        .duration(30)
        .style('transform', `translate(${newVal[0] + 20}px, ${newVal[1] + 20}px)`);
    } else {
      this.selection.transition()
        .duration(30)
        .style('transform', `translate(${newVal[0] + 20}px, ${newVal[1] + 20}px)`);
    }
  }

  private textControl (newVal) {
    const details: MySelection = this.selection.selectAll('.detail');
    (this.options.legend as any).forEach((val, index) => {
      if (newVal.indexOf(val) === -1) {
        details.filter((d, k) => {
          return k === index;
        }).classed('visible', false).classed('h3-hidden', true);
      } else {
        details.filter((d, k) => {
          return k === index;
        }).classed('visible', false).classed('h3-hidden', false);
      }
    });
  }

  // 切换饼图区域
  private changeItem (newVal) {
    this.itemSerie.data.some((d, i) => {
      if (d.name === newVal) {
        this.itemIndex = i;
        return true;
      }
      return false;
    });
    this.selection.html(this.options.formatter.replace(/{(\w)}/g, ($1, $2) => {
      switch (this.dictionary[$2]) {
        case 'title':
          return this.itemTitle;
        case 'name':
          return this.itemName;
        case 'value':
          return this.itemValue;
        case 'rate':
          return this.itemRate;
      }
    }));
  }
}
