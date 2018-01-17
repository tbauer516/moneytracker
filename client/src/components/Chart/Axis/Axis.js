import React, { Component } from 'react';
import * as d3 from 'd3';

class Axis extends Component {
	render() {
		return (
			<g ref={this.onRef} className='chart-axis'></g>
		);
	};

	onRef = (ref) => {
		this.setState({
			node: ref
		});
	};

	componentDidUpdate(prevProps, prevState) {
		this.renderAxis(
			this.props.options,
			this.props.margin,
			this.props.dimensions,
			this.props.axisFontSize
		);
	};

	renderAxis(
		options,
		margin,
		dimensions,
		axisFontSize
	) {
		const svgWidth = dimensions.body.w;
		const svgHeight = dimensions.body.h;
		const gWidth = svgWidth - margin.left - margin.right;
		// const gHeight = svgHeight - margin.top - margin.bottom;

		const barsG = d3.select(this.state.node);

		// X AXIS
		const x = dimensions.scale.x;
		let xAxis = barsG.select('g.xAxis');
		
		if (xAxis.empty())
			xAxis = barsG.append('g')
				.attr('class', 'axis xAxis')
				.attr('transform', 'translate(' + margin.left + ', ' + (svgHeight - margin.bottom) + ')');

		xAxis.call(
			d3.axisBottom(x)
			.tickValues(options.xTicks)
			.tickFormat(d3.timeFormat("%B %d, %Y"))
		);

		if (options.xTitle) {
			xAxis.append('text')
				.attr('x', gWidth)
				.attr('y', margin.bottom / 2)
				.attr('font-size', axisFontSize)
				.attr('fill', '#000000')
				.attr('text-anchor', 'end')
				.style('transform', 'translate(0, 1em')
				.text(options.xTitle);
		}

		// Y AXIS
		const y = dimensions.scale.y;
		let yAxis = barsG.select('g.yAxis');
		if (yAxis.empty())
			yAxis = barsG.append('g')
				.attr('class', 'axis yAxis')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		yAxis.call(d3.axisLeft(y));

		if (options.yTitle) {
			yAxis.append('text')
				.attr('x', 0)
				.attr('y', 0)
				.attr('font-size', axisFontSize)
				.attr('fill', '#000000')
				.attr('text-anchor', 'end')
				.style('transform', 'translate(-3em, 0) rotate(-90deg)')
				.text(options.yTitle);
		}
	};
};

export default Axis;