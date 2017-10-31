import DrawLineChart from '@/charts/lineChart';
import DrawPieChart from '@/charts/pieChart';
import '@/common/initTransition'; // 将transition 在这里统一初始化
import './styles/common.scss';
import './styles/reset.scss'; // css 写在前面，注意加载顺序

const pieChart = new DrawPieChart({
  size: {
    width: 600,
    height: 800
  },
  boundary: {
    left: 60
  },
  tooltip: {
    formatter: `{a} <br/>{b} : {c} ({d}%)`
  },
  legend: {
    offset: {
      left: '10%',
      top: '5%'
    }
  },
  isDrawEventContainer: false,
  series: [{
    radius: '55%',
    title: '访问来源',
    center: ['50%', '50%'],
    data: [{
      name: '幽州',
      color: '#c23531',
      value: 1548
    }, {
      name: '荆州',
      color: '#2f4554',
      value: 535
    }, {
      name: '兖州',
      color: '#61a0a8',
      value: 510
    }, {
      name: '益州',
      color: '#d48265',
      value: 634
    }, {
      name: '西凉',
      color: '#91c7ae',
      value: 735
    }]
  }]
});

const lineChart = new DrawLineChart({
  size: { // 默认通过容器宽高获取
    width: 600,
    height: 600
  },
  tooltip: {
    title: [...Array(14).fill(0)].map((d, i) => i + 2000)
  },
  isDrawEventContainer: true,
  legend: ['China', 'Japan', 'America'],
  boundary: {
    left: 60
  },
  xAxis: {
    data: [...Array(14).fill(0)].map((d, i) => i + 2000)
  },
  series: [{
    name: 'China',
    type: 'broken',
    lineStyle: {
      color: '#c23531'
    },
    data: [11920, 13170, 14550, 16500, 19440, 22870, 27930, 35040, 45470, 51050, 59490, 73140, 83860, 103550]
  }, {
    name: 'Japan',
    type: 'broken',
    lineStyle: {
      color: '#2f4554'
    },
    data: [47310, 41590, 39800, 43020, 46550, 45710, 45710, 43560, 48490, 50350, 54950, 59050, 59370, 48980]
  }, {
    name: 'America',
    type: 'broken',
    lineStyle: {
      color: '#61a0a8'
    },
    data: [101310, 107590, 109800, 113020, 116550, 125710, 129710, 133560, 138490, 140350, 144950, 159050, 169370, 178980]
  }]
});
