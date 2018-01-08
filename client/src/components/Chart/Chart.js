import React, { Component } from 'react';
import './Chart.css';
import * as d3 from 'd3';
import Axis from './Axis/Axis.js';
import LineChart from './Visual/LineChart.js';
import ScatterPlot from './Visual/ScatterPlot.js';
import BarChart from './Visual/BarChart.js';

class Chart extends Component {

	constructor(props) {
		super();

		this.state = {
			initialRender: false,
			node: null,
			data: props.data,
			xDomain: props.xDomain,
			yDomain: props.yDomain,
			options: {
				chartTitle: props.options.chartTitle || null,
				xTitle: props.options.xTitle || null,
				yTitle: props.options.yTitle || null,
				xTicks: props.options.xTicks || null,
				yTicks: props.options.yTicks || null,
				axisFontSize: '1.5em'
			},
			config: { radius: 3, stroke: 1 },
			margin: { top: 20, right: 20, bottom: 40, left: 60 },
			dimensions: {
				w: null,
				h: null,
				scale: { x: null, y: null }
			}
		};
	};

	render() {
		console.log(`${this.constructor.name} rendered`);
		const ChartType = this.getChartByName(this.props.type);
		
		const rendered = this.state.initialRender;
		const axis = rendered ? <Axis options={ this.state.options } margin={ this.state.margin } dimensions={ this.state.dimensions } /> : '';
		const chart = rendered ? <ChartType data={this.state.data} config={ this.state.config } margin={ this.state.margin } dimensions={ this.state.dimensions } /> : '';

		return (
			<div className='chart-root'>
				<div className='chart-container'>
					<svg ref={ this.onRef }>
						{axis}
						{chart}
					</svg>
				</div>
			</div>
		);
	};

	onRef = (ref) => {
		const svg = d3.select(ref);
		const margin = this.state.margin;

		const svgWidth = +svg.style('width').replace('px', '');
		const svgHeight = +svg.style('height').replace('px', '');
		const gWidth = svgWidth - margin.left - margin.right;
		const gHeight = svgHeight - margin.top - margin.bottom;

		this.setState({
			node: ref,
			initialRender: true,

			dimensions: {
				w: svgWidth,
				h: svgHeight,
				scale: {
					x: d3.scaleLinear().domain(this.state.xDomain).range([0, gWidth]),
					y: d3.scaleLinear().domain(this.state.yDomain).range([gHeight, this.state.config.radius])
				}
			}
		});
	};

	getChartByName(name) {
		const charts = {
			ScatterPlot: ScatterPlot,
			LineChart: LineChart,
			BarChart: BarChart
		}
		return charts[name];
	};
};

export default Chart;