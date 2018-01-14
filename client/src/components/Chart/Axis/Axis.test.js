import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import net from '../../../net';
import Data from '../../Data/Data';
import Chart from '../Chart';
import Axis from './Axis';

let data;
let axis;
let config;

beforeEach(() => {
	return net.fetchEndpoint('/data', 'text').then(rawData => {
		data = new Data(rawData);
		config = Chart.config;
		config.dimensions = {
			body: { w: 500, h: 500 },
			scale: Chart.getScales(500, 500, Chart.config.margin, data.getDomainDay(), data.getDomainSpent())
		};
		axis = mount(<Axis options={{ xTitle: 'Day', yTitle: '$ Spent', xTicks: data.getMonths() }} margin={ config.margin } dimensions={ config.dimensions } />);
		return true;
	});
});

describe('the Axis', () => {

	it('renders without crashing', () => {
		expect(axis).not.toBeUndefined();
	});

	it('contains two axis', () => {
		expect(axis.state().node.children.length).toBe(2);
	});

	it('contains a `g` element', () => {
		const g = axis.find('g');
		expect(g.length).toBe(1);
	});

	it('receives a `options` prop', () => {
		expect(axis.props().options).not.toBeUndefined();
	});

	it('receives a `margin` prop', () => {
		expect(axis.props().margin).not.toBeUndefined();
	});

	it('receives a `dimensions` prop', () => {
		expect(axis.props().dimensions).not.toBeUndefined();
	});

});