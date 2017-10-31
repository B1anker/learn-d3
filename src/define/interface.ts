export interface Boundary {
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
}

export interface VisibleSize {
  width: number;
  height: number;
}

export interface BaseChartSize {
  width: number;
  height: number;
}

export interface BaseChartOptions {
  selector?: string;
  size: BaseChartSize;
  boundary?: Boundary;
  isDrawEventContainer: boolean;
}

export interface LineSeriesItem {
  name: string;
  type: string;
  lineStyle: {
    color: string;
  };
  data: string[] | number[] | (() => number[] | string[]);
}

export interface LineChartExternal extends BaseChartOptions {
  legend?: string[] | number[];
  xAxis: {
    data: any[];
  };
  tooltip: {
    title: any;
  };
  series: LineSeriesItem[];
}

export interface PieSeriesItem {
  value: number;
  color: string;
  name: string | number;
}

export interface PieChartExternal extends BaseChartOptions {
  legend: {
    offset?: {
      left: string;
      top: string;
    }
  };
  tooltip: {
    formatter: string;
  };
  series: [{
    title?: string,
    radius: string;
    center: [string, string];
    data: PieSeriesItem[] | (() => PieSeriesItem[])
  }];
}
