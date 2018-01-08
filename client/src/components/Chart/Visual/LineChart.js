import React, { Component } from 'react';
import * as d3 from 'd3';

class LineChart extends Component {
	render() {
		console.log(`${this.constructor.name} rendered`);
		return (
			<g ref={ this.onRef } className='chart-vis'></g>
		);
	};

	onRef = (ref) => {
		this.setState({ node: ref });
	};

	componentDidUpdate(prevProps, prevState) {
		this.renderChart(
			this.props.data,
			this.props.config,
			this.props.margin,
			this.props.dimensions
		);
	};

	renderChart(
		data,
		config,
		margin,
		dimensions
	) {
		const dataG = d3.select(this.state.node)
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		
		let x = dimensions.scale.x;
		
		let y = dimensions.scale.y;

		let line = d3.line()
			.curve(d3.curveCardinal.tension(.8))
			.x((d) => { return x(d.date); })
			.y((d) => { return y(d.spent); })

		dataG.append('path')
			.datum(data)
			.attr('fill', 'none')
			.attr('stroke', '#000000')
			.attr('stroke-width', config.stroke)
			.attr('d', line);
	};
};

export default LineChart;