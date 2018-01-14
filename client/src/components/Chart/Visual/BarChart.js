import BaseChart from './BaseChart.js';
import * as d3 from 'd3';

class BarChart extends BaseChart {
	renderViz(
		node,
		data,
		config,
		margin,
		dimensions
	) {
		let x = dimensions.scale.x;
		let y = dimensions.scale.y;

		let bar = node.selectAll('rect')
			.data(data);

		bar.enter()
			.append('rect')
			.attr('fill', '#000000')
			.attr('x', (d) => { return x(d.date); })
			.attr('y', (d) => { return y(d.spent); })
			.attr('width', (d) => { let today = new Date(); return x(today.setHours(today.getHours() + 18)) - x(new Date()); })
			.attr('height', (d) => { return dimensions.body.h - margin.top - margin.bottom - y(d.spent); })
			.merge(bar);

		bar.exit()
			.remove();
	};
};

export default BarChart;