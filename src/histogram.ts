import * as d3 from 'd3';
export default function histogram () {
  interface Position {
    left: number;
    top: number;
    bottom: number;
    right: number;
  }

  const margin: Position = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 30
  };
  const rectStop: number = 35;
  const rectWidth: number = 30;
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.height = 400;
  canvas.width = 400;
  const height: number = canvas.height - margin.left - margin.right;
  const width: number = canvas.width - margin.top - margin.bottom;
  document.body.appendChild(canvas);
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

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

  const x0 = d3.scaleBand().domain(data.map((d) => {
    return d.name;
  })).rangeRound([0, width]).padding(.5);

  const y0 = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => {
      return d.value;
    })])
    .range([height, 0]);

  ctx.translate(margin.left, margin.top);
  ctx.beginPath();
  x0.domain().forEach((d) => {
    ctx.moveTo(x0(d) + x0.bandwidth() / 2, height);
    ctx.lineTo(x0(d) + x0.bandwidth() / 2, height + 6);
  });
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  x0.domain().forEach((d) => {
    ctx.fillText(d, x0(d) + x0.bandwidth() / 2, height + 6);
  });
  ctx.beginPath();
  ctx.moveTo(.5, height + .5);
  ctx.lineTo(width + 0.5, height + 0.5);
  ctx.strokeStyle = 'black';
  ctx.stroke();
  const yTickCount = 10;
  const yTicks = y0.ticks(yTickCount);
  ctx.beginPath();
  yTicks.forEach((d) => {
    ctx.moveTo(0, y0(d) + 0.5);
    ctx.lineTo(-6, y0(d) + 0 / 5);
  });
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  yTicks.forEach((d) => {
    ctx.fillText((d).toString(), -9, y0(d));
  });
  ctx.beginPath();
  ctx.moveTo(0, .5);
  ctx.lineTo(0, height + .5);
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.fillStyle = 'steelblue';
  data.forEach((d) => {
    ctx.fillRect(x0(d.name), y0(d.value), x0.bandwidth(), height - y0(d.value));
  });
}
