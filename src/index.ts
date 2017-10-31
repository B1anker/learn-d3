import DrawLineChart from '@/charts/lineChart';
import DrawPieChart from '@/charts/pieChart';
import '@/common/initTransition'; // 将transition 在这里统一初始化
import './styles/common.scss';
import './styles/reset.scss'; // css 写在前面，注意加载顺序

export {
  DrawLineChart,
  DrawPieChart
};
