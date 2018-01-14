import React, { Component } from 'react';
import * as d3 from 'd3';

class BaseChart extends Component {
	render() {
		// console.log(`${this.constructor.name} rendered`);
		return (
			<g ref={ this.onRef } className='chart-vis'><circle></circle></g>
		);
	};

	onRef = (ref) => {
		this.setState({
			node: ref
		});
	};

	componentDidUpdate(prevProps, prevState) {
		const node = d3.select(this.state.node)
			.attr('transform', 'translate(' + this.props.margin.left + ', ' + this.props.margin.top + ')');
		
		this.renderViz(
			node,
			this.props.data,
			this.props.config,
			this.props.margin,
			this.props.dimensions
		);
	};

	renderViz(
		node,
		data,
		config,
		margin,
		dimensions
	) {
		
	};
};

export default BaseChart;