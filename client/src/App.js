import React, { Component } from 'react';
import './App.css';
import net from './net';
// import * as d3 from 'd3';

import Data from './components/Data/Data';
import Chart from './components/Chart/Chart';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
	};

	render() {
		const data = this.state.data;
		if (!data)
			return ('');

		return (
			<div className="app-root">
				<Chart type='LineChart' data={data.getSumBy('day')} xDomain={data.getDomainTime('day')} yDomain={data.getDomainSpent('day')} options={{ xTitle: 'Day', yTitle: '$ Spent', xTicks: data.getListBy('month') }} />
				<Chart type='ScatterPlot' data={data.getSumBy('day')} xDomain={data.getDomainTime('day')} yDomain={data.getDomainSpent('day')} options={{ xTitle: 'Day', yTitle: '$ Spent', xTicks: data.getListBy('month') }} />
				<Chart type='BarChart' data={data.getSumBy('day')} xDomain={data.getDomainTime('day')} yDomain={data.getDomainSpent('day')} options={{ xTitle: 'Day', yTitle: '$ Spent', xTicks: data.getListBy('month') }} />
				<Chart type='BarChart' data={data.getSumBy('month')} xDomain={data.getDomainTime('month')} yDomain={data.getDomainSpent('month')} options={{ xTitle: 'Month', yTitle: '$ Spent', xTicks: data.getListBy('month') }} />
      		</div>
    	);
	};

    // componentWillUnmount() {
    //     window.removeEventListener("resize", this.updateDimensions);
    // };

	componentDidMount() {
		// window.addEventListener("resize", this.updateDimensions);

		net.fetchEndpoint('/data', 'text').then(rawData => {
			const dataHolder = new Data(rawData);
			this.setState({
				data: dataHolder
			});
		});
	};

	// updateDimensions = () => {
	// 	this.setState({ width: window.innerWidth, height: window.innerHeight });
	// };
};

export default App;
