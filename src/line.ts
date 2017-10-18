import { max } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import { BaseType, select, Selection } from 'd3-selection';
import { CanvasSize } from './declare';
import Axis, { ChartSize } from './materials/axis';

interface Boundary {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

export default function () {
  const boundary: Boundary = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  const canvasSize: CanvasSize = {
    width: 400,
    height: 400
  };
  const chartSize: ChartSize = {
    width: canvasSize.width - boundary.left - boundary.right,
    height: canvasSize.height - boundary.top - boundary.bottom
  };
  const rectStop: number = 35;
  const rectWidth: number = 30;

  const canvas: any = select ('body').append('canvas')
    .attr('width', canvasSize.width)
    .attr('height', canvasSize.height);
  const ctx: CanvasRenderingContext2D = canvas.node().getContext('2d');

  const data = [{
    name: '办公用品',
    value: 100
  }, {
    name: '家具',
    value: 20
  }, {
    name: '技术',
    value: 60
  }];

  const xAxisRuler = scaleBand().domain(data.map((d) => {
    return d.name;
  }))
    .rangeRound([0, chartSize.width])
    .padding(.5);

  const yAxisRuler = scaleLinear().domain([0, max(data, (d) => {
    return d.value;
  })])
    .rangeRound([chartSize.height, 0]);
  const yTickCount = 10;
  const yTicks = yAxisRuler.ticks(yTickCount);

  const xAxis = new Axis(canvas.node(), xAxisRuler, xAxisRuler.domain(), {
    direction: 'verticle',
    chartSize: {
      height: chartSize.height,
      width: chartSize.width
    },
    offset: {
      x: xAxisRuler.bandwidth() / 2
    },
    length: 6
  });
  xAxis.drawScale({
    color: 'red'
  });
  xAxis.drawLine({
    color: 'green'
  });

  const yAxis = new Axis(canvas.node(), yAxisRuler, yTicks, {
    direction: 'align',
    chartSize: {
      height: chartSize.height,
      width: chartSize.width
    },
    offset: {
      x: 0
    },
    length: 6
  });
  yAxis.drawScale({
    color: 'blue'
  });
  yAxis.drawLine();
}
