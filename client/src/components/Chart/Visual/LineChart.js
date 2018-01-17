import BaseChart from './BaseChart.js';
import * as d3 from 'd3';

class LineChart extends BaseChart {
	renderViz(
		node,
		data,
		config,
		margin,
		dimensions
	) {
		let x = dimensions.scale.x;
		let y = dimensions.scale.y;

		let line = d3.line()
			// .curve(d3.curveCardinal.tension(.9))
			// .curve(d3.curveCatmullRom.alpha(.05))
			// .curve(d3.curveNatural)
			// .curve(d3.curveMonotoneX)
			.curve(d3.curveLinear)
			// .curve(d3.curveBundle.beta(1))
			// .curve(d3.curveBasis)
			.x((d) => { return x(d.key); })
			.y((d) => { return y(d.val); })

		node.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', '#000000')
			.attr('stroke-width', config.stroke)
			.attr('d', line);
	};
};

export default LineChart;