import BaseChart from './BaseChart.js';
// import * as d3 from 'd3';

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

		const extent = x.domain();
		const min = new Date(extent[0]);
		const max = new Date(extent[1]);

		const numDays = Math.floor((max - min) / (1000*60*60*24));

		min.setDate(1);
		max.setDate(1);
		let temp = new Date(min.getTime());
		let numMonths = 1;
		while (temp.getTime() < max.getTime()) {
			temp.setMonth(temp.getMonth() + 1);
			numMonths++;
		}

		min.setMonth(0);
		max.setMonth(0);
		temp = new Date(min.getTime());
		let numYears = 1;
		while (temp.getTime() < max.getTime()) {
			temp.setFullYear(temp.getFullYear() + 1);
			numYears++;
		}

		let numBuckets = numDays;

		if (data.length <= numMonths)
			numBuckets = numMonths;

		if (data.length <= numYears)
			numBuckets = numYears;


		let bar = node.selectAll('rect')
			.data(data);

		bar.enter()
			.append('rect')
			.attr('fill', '#000000')
			.attr('x', (d) => { return x(d.key); })
			.attr('y', (d) => { return y(d.val); })
			.attr('width', (d) => {
				const width = x(extent[1]) - x(extent[0]);
				const bar = width / numBuckets;
				return bar - 2;
			})
			.attr('height', (d) => { return dimensions.body.h - margin.top - margin.bottom - y(d.val); })
			.merge(bar);

		bar.exit()
			.remove();
	};
};

export default BarChart;