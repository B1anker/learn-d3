export interface Boundary {
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
}

export interface LineSeriesItem {
  name: string;
  type: string;
  lineStyle: {
    color: string;
  };
  data: any[];
}

export interface LineChartExternal {
  selector: string;
  size: {
    width: number;
    height: number;
  };
  boundary: Boundary;
  xAxis: {
    data: any[];
  };
  series: LineSeriesItem[];
}
