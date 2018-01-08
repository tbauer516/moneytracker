import BaseChart from './BaseChart.js';
import * as d3 from 'd3';

class ScatterPlot extends BaseChart {
	renderViz(
		node,
		data,
		config,
		margin,
		dimensions
	) {
		let x = dimensions.scale.x;
		let y = dimensions.scale.y;

		let circ = node.selectAll('circle')
			.data(data);

		circ.enter()
			.append('circle')
			.attr('fill', '#000000')
			.attr('r', config.radius)
			.attr('cx', (d) => { return x(d.date); })
			.attr('cy', (d) => { return y(d.spent); })
			.merge(circ);

		circ.exit()
			.remove();

	};
};

export default ScatterPlot;