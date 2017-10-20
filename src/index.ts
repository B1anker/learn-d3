import DrawLineChart from './charts/lineChart';

const lineChart = new DrawLineChart({
  selector: 'svg',
  size: {
    width: 600,
    height: 600
  },
  boundary: {
    left: 60
  },
  xAxis: {
    data: [...Array(14).fill(0)].map((d, i) => i + 2000)
  },
  series: [{
    name: 'china',
    type: 'broken',
    lineStyle: {
      color: '#c23531'
    },
    data: [11920, 13170, 14550, 16500, 19440, 22870, 27930, 35040, 45470, 51050, 59490, 73140, 83860, 103550]
  }, {
    name: 'japan',
    type: 'broken',
    lineStyle: {
      color: '#2f4554'
    },
    data: [47310, 41590, 39800, 43020, 46550, 45710, 45710, 43560, 48490, 50350, 54950, 59050, 59370, 48980]
  }, {
    name: 'ameraica',
    type: 'broken',
    lineStyle: {
      color: '#61a0a8'
    },
    data: [101310, 107590, 109800, 113020, 116550, 125710, 129710, 133560, 138490, 140350, 144950, 159050, 169370, 178980]
  }]
});
