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

	static config = {
		visual: { radius: 3, stroke: 1},
		margin: { top: 20, right: 20, bottom: 40, left: 60 },
		axisFontSize: '1.5em'
	};

	render() {
		// console.log(`${this.constructor.name} rendered`);
		const ChartType = this.getChartByName(this.props.type);
		
		const rendered = this.state.initialRender;
		const axis = rendered ? <Axis options={ this.props.options } margin={ Chart.config.margin } axisFontSize={ Chart.config.axisFontSize } dimensions={ this.state.dimensions } /> : '';
		const chart = rendered ? <ChartType data={this.props.data} config={ Chart.config.visual } margin={ Chart.config.margin } dimensions={ this.state.dimensions } /> : '';

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

		const svgWidth = +svg.style('width').replace('px', '');
		const svgHeight = +svg.style('height').replace('px', '');

		this.setState({
			node: ref,
			initialRender: true,
			dimensions: {
				body: { w: svgWidth, h: svgHeight },
				scale: Chart.getScales(
					svgWidth,
					svgHeight,
					Chart.config.margin,
					this.props.xDomain,
					this.props.yDomain
				)
			}
		});
	};

	static getScales(svgW, svgH, margin, xDomain, yDomain) {
		const gW = svgW - margin.left - margin.right;
		const gH = svgH - margin.top - margin.bottom;

		return {
			x: d3.scaleLinear().domain(xDomain).range([0, gW]),
			y: d3.scaleLinear().domain(yDomain).range([gH, 0 /*Chart.config.visual.radius*/])
		};
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