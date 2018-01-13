import React, { Component } from 'react';
import './Chart.css';
import * as d3 from 'd3';
import Axis from './Axis/Axis.js';
import LineChart from './Visual/LineChart.js';
import ScatterPlot from './Visual/ScatterPlot.js';
import BarChart from './Visual/BarChart.js';

class Chart extends Component {

	constructor(props) {
		super(props);

		this.static = {
			config: { radius: 3, stroke: 1 },
			margin: { top: 20, right: 20, bottom: 40, left: 60 },
			axisFontSize: '1.5em'
		};

		// options: chartTitle, xTitle, yTitle, xTicks, yTicks

		this.state = {
			initialRender: false,
			node: null,
			dimensions: {
				w: null,
				h: null,
				scale: { x: null, y: null }
			}
		};
	};

	render() {
		// console.log(`${this.constructor.name} rendered`);
		const ChartType = this.getChartByName(this.props.type);
		
		const rendered = this.state.initialRender;
		const axis = rendered ? <Axis options={ this.props.options } margin={ this.static.margin } dimensions={ this.state.dimensions } /> : '';
		const chart = rendered ? <ChartType data={this.props.data} config={ this.static.config } margin={ this.static.margin } dimensions={ this.state.dimensions } /> : '';

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
		const margin = this.static.margin;

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
					x: d3.scaleLinear().domain(this.props.xDomain).range([0, gWidth]),
					y: d3.scaleLinear().domain(this.props.yDomain).range([gHeight, this.static.config.radius])
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