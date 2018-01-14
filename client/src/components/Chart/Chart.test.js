import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import net from '../../net';
import Data from '../Data/Data';
import Chart from './Chart';
import Axis from './Axis/Axis';
import LineChart from './Visual/LineChart';
import BaseChart from './Visual/BaseChart';

let data;
let chart;

beforeEach(() => {
	return net.fetchEndpoint('/data', 'text').then(rawData => {
		data = new Data(rawData);
		chart = mount(<Chart type='LineChart' data={data.getSumByDay()} xDomain={data.getDomainDay()} yDomain={data.getDomainSpent()} options={{ xTitle: 'Day', yTitle: '$ Spent', xTicks: data.getMonths() }} />);
		return true;
	});
});

describe('the chart', () => {

	it('renders without crashing', () => {
		expect(chart).not.toBeUndefined();
	});

	it('contains an axis', () => {
		const axis = chart.find(Axis);
		expect(axis.name()).toEqual('Axis');
	});

	it('contains a visual', () => {
		const viz = chart.find(LineChart).instance();
		expect(viz.constructor.name).toEqual('LineChart');
		expect(viz instanceof BaseChart).toBe(true);
	});

	it('receives a `type` prop', () => {
		expect(chart.props().type).not.toBeUndefined();
	});

	it('receives a `data` prop', () => {
		expect(chart.props().data).not.toBeUndefined();
	});

	it('receives an `xDomain` prop', () => {
		expect(chart.props().xDomain).not.toBeUndefined();
	});

	it('receives a `yDomain` prop', () => {
		expect(chart.props().yDomain).not.toBeUndefined();
	});

});