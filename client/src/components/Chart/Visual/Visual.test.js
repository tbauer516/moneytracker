import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import net from '../../../net';
import Data from '../../Data/Data';
import Chart from '../Chart';
import LineChart from './LineChart';
import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot';

const classes = [ BarChart, LineChart, ScatterPlot ];

const testClass = (Visual) => {

	describe(`the ${Visual.name}`, () => {

		let data;
		let chart;
		let config;

		beforeEach(() => {
			return net.fetchEndpoint('/data', 'text').then(rawData => {
				data = new Data(rawData);
				config = Chart.config;
				config.dimensions = {
					body: { w: 500, h: 500 },
					scale: Chart.getScales(500, 500, Chart.config.margin, data.getDomainDay(), data.getDomainSpent())
				};
				chart = mount(<Visual data={data.getSumByDay()} config={ config.visual } margin={ config.margin } dimensions={ config.dimensions } />);
				return true;
			});
		});

		it('renders without crashing', () => {
			expect(chart).not.toBeUndefined();
		});

		it('contains at least one data point', () => {
			expect(chart.state().node.children.length).toBeGreaterThan(0);
		});

		it('contains a `g` element', () => {
			const g = chart.find('g');
			expect(g.length).toBe(1);
		});

		it('receives a `data` prop', () => {
			expect(chart.props().data).not.toBeUndefined();
		});

		it('receives an `config` prop', () => {
			expect(chart.props().config).not.toBeUndefined();
		});

		it('receives a `margin` prop', () => {
			expect(chart.props().margin).not.toBeUndefined();
		});

		it('receives a `dimensions` prop', () => {
			expect(chart.props().dimensions).not.toBeUndefined();
		});

	});

};

for (let i = 0; i < classes.length; i++) {
	testClass(classes[i]);
}