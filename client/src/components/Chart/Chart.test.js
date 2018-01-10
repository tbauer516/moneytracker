import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import App from '../../App';
import Chart from './Chart';

let app;

beforeAll(() => {
	app = mount(<App />);
	return Promise.resolve();
});

beforeEach(() => {
	app.update();
	return Promise.resolve();
});

describe('the app', () => {

	it('contains some charts', () => {
		const charts = app.find(Chart);
		console.log(charts);
		for (let i = 0; i < charts.length; i++) {
			expect(charts.at(i).name()).toEqual('Chart');
		}
	});
});