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
			.curve(d3.curveCardinal.tension(.8))
			.x((d) => { return x(d.date); })
			.y((d) => { return y(d.spent); })

		node.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', '#000000')
			.attr('stroke-width', config.stroke)
			.attr('d', line);
	};
};

export default LineChart;