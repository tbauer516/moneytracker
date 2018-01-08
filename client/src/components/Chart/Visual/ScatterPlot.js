import React, { Component } from 'react';
import * as d3 from 'd3';

class ScatterPlot extends Component {
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

		let circ = dataG.selectAll('circle')
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