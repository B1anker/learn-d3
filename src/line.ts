import { max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import Axis from './materials/axis';

interface SvgSize {
  width: number;
  height: number;
}

interface Boundary {
  top: number;
  right: number;
  left: number;
  bottom: number;
}

const dataset = [{
  country: 'china',
  gdp: [[2000, 11920], [2001, 13170], [2002, 14550], [2003, 16500], [2004, 19440], [2005, 22870], [2006, 27930], [2007, 35040], [2008, 45470], [2009, 51050], [2010, 59490], [2011, 73140], [2012, 83860], [2013, 103550]]
}, {
  country: 'japan',
  gdp: [[2000, 47310], [2001, 41590], [2002, 39800], [2003, 43020], [2004, 46550], [2005, 45710], [2006, 45710], [2007, 43560], [2008, 48490], [2009, 50350], [2010, 54950], [2011, 59050], [2012, 59370], [2013, 48980]]
}];

const svgSize: SvgSize = {
  width: 300,
  height: 300
};

const padding: Boundary = {
  top: 50,
  right: 50,
  left: 50,
  bottom: 50
};

let gdpMax: number = 0;

dataset.forEach((data) => {
  const currGdp = max(data.gdp, (d) => {
    return d[1];
  });
  if (currGdp > gdpMax) {
    gdpMax = currGdp;
  }
});

const xScale = scaleLinear().domain([2000, 2013])
  .range([0, svgSize.width - padding.left - padding.right]);

const yScale = scaleLinear().domain([0, gdpMax * 1.1])
  .range([0, svgSize.width - padding.left - padding.right]);
