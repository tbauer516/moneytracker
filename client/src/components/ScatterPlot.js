import React, { Component } from 'react';
import './Chart.css';
import * as d3 from 'd3';

class ScatterPlot extends Component {
	render() {
		console.log('ScatterPlot rendered');
		return (
			<div className='chart-container-container'>
				<div className='chart-container'>
					<svg ref={ this.onRef }></svg>
				</div>
			</div>
		);
	};

	onRef = (ref) => {
		this.setState({ node: ref });
	};

	componentDidUpdate(nextProps, nextState) {
		this.renderd3(
			this.props.data,
			this.props.chartID,
			this.props.xDomain,
			this.props.yDomain,
			this.props.options
		);
	};

	renderd3(
		data,
		chartID,
		xDomain,
		yDomain,
		options = {
			chartTitle: null,
			xTitle: null,
			yTitle: null
		}
	) {

		// styling configs used below
		const margin = { top: 20, right: 20, bottom: 40, left: 60 };
		const config = { axisFontSize: '1.5em', radius: 3, stroke: 1 };

		// top level svg element for chart
		const svg = d3.select(this.state.node);

		// sizing of svg canvas; always fills the parent container
		let svgWidth = +svg.style('width').replace('px', '');
		let svgHeight = +svg.style('height').replace('px', '');
		let gWidth = svgWidth - margin.left - margin.right;
		let gHeight = svgHeight - margin.top - margin.bottom;

		// two groups, one for the axes, one for the data
		const barsG = svg.append('g');
		const dataG = svg.append('g')
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		let x = d3.scaleLinear()
			.domain(xDomain)
			.range([0, gWidth]);

		let xAxis = svg.select('g.xAxis');
		
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
				.attr('font-size', config.axisFontSize)
				.attr('fill', '#000000')
				.attr('text-anchor', 'end')
				.text(options.xTitle);
		}

		let y = d3.scaleLinear()
			.domain(yDomain)
			.range([gHeight - config.radius, config.radius]);
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
				.attr('font-size', config.axisFontSize)
				.attr('fill', '#000000')
				.attr('text-anchor', 'end')
				.style('transform', 'translate(' + config.axisFontSize + ', 0) rotate(-90deg)')
				.text(options.yTitle);
		}

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