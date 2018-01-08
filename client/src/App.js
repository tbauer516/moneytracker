import React, { Component } from 'react';
import './App.css';
import { fetchEndpoint } from './utilities.js';
import * as d3 from 'd3';

import Chart from './components/Chart/Chart.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rawData: null
		};
	};

	render() {
		console.log('App rendered');
		const rawData = this.state.rawData;
		if (!rawData)
			return (<div></div>);

		let parsedData = d3.csvParse(rawData, (d) => {
			return {
				time: new Date(d.Timestamp),
				date: new Date(d.Date),
				location: d.Location,
				category: d.Category,
				spent: +d.Spent,
				received: +d.Received,
				budget: +d.Budget,
				purchased: d['Purchased By'],
				itemFor: d['Item For']
			}
		});
		
		// foreach data point, make a Date object for the first of the month the
		// purchase was made. Check it doesn't exist already and add it if not
		// returns an array of sorted Dates for all months where data is present
		const months = parsedData.reduce((res, d) => {
			let firstOf = new Date(d.date);
			firstOf.setDate(1);
			firstOf.setHours(0);
			firstOf.setMinutes(0);
			firstOf.setSeconds(0);
			firstOf.setMilliseconds(0);
		
			let firstOfMillis = firstOf.getTime();
		
			if (res.indexOf(firstOfMillis) === -1)
				res.push(firstOfMillis);
		
			return res.sort((a, b) => { return a - b; });
		}, []);
		
		console.log(parsedData);
		
		// combine transactions by day
		const dataByDay = d3.nest()
			.key((d) => { return d.date.getTime(); })
		.rollup((leaves) => {
			return d3.sum(leaves, (d) => {
				return d.spent;
			});
		})
		.entries(parsedData)
		.map((d) => {
			return { date: new Date(+d.key), spent: d.value };
		});
		
		const xDomainByDay = [
			Math.min(d3.min(dataByDay, (d) => { return d.date; }), months[0]) - (1000*60*60*24*5),
			Math.max(d3.max(dataByDay, (d) => { return d.date; }), months[months.length - 1]) + (1000*60*60*24*5)
		];
		
		const yDomainByDay = d3.extent(dataByDay, (d) => { return d.spent; });

    	return (
			<div className="app-root">
				<Chart  type='LineChart' data={dataByDay} xDomain={xDomainByDay} yDomain={yDomainByDay} options={{ xTitle: 'Day', yTitle: '$ Spent', xTicks: months }} />
				<Chart  type='ScatterPlot' data={dataByDay} xDomain={xDomainByDay} yDomain={yDomainByDay} options={{ xTitle: 'Day', yTitle: '$ Spent', xTicks: months }} />
				<Chart  type='BarChart' data={dataByDay} xDomain={xDomainByDay} yDomain={yDomainByDay} options={{ xTitle: 'Day', yTitle: '$ Spent', xTicks: months }} />
      		</div>
    	);
	};

    // componentWillUnmount() {
    //     window.removeEventListener("resize", this.updateDimensions);
    // };

	componentDidMount() {
		// window.addEventListener("resize", this.updateDimensions);

		fetchEndpoint('/data', 'text').then(rawData => {
			this.setState({
				rawData: rawData
			});
		});
	};

	// updateDimensions = () => {
	// 	this.setState({ width: window.innerWidth, height: window.innerHeight });
	// };
};

export default App;
