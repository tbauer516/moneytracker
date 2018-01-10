import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import App from './App';

describe('the main app container', () => {
	it('renders without crashing', () => {
		mount(<App />);
	});

	it('contains only a single wrapping div', () => {
		const app = mount(<App />);
		const divs = app.find('div');
		const first = divs.first();

		expect(first.children()).toEqual(app.children());
	});
});