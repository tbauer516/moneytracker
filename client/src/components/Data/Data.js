import * as d3 from 'd3';

class Data {
	constructor(rawDataBlob) {
		this.raw = this.parseDataBlob(rawDataBlob);
		this.fields = this.generateEnum(this.raw);
	};

	getMonths() {
		if (this.months)
			return this.months;

		const months = this.raw.reduce((res, d) => {
			const firstOf = new Date(d.date);
			firstOf.setDate(1);
			firstOf.setHours(0);
			firstOf.setMinutes(0);
			firstOf.setSeconds(0);
			firstOf.setMilliseconds(0);
		
			const firstOfMillis = firstOf.getTime();
		
			if (res.indexOf(firstOfMillis) === -1)
				res.push(firstOfMillis);
		
			return res.sort((a, b) => { return a - b; });
		}, []);

		this.months = months;
		return this.months;
	};

	getSumByDay() {
		if (this.sumByDay)
			return this.sumByDay;

		const dataByDay = d3.nest()
			.key((d) => { return d.date.getTime(); })
		.rollup((leaves) => {
			return d3.sum(leaves, (d) => {
				return d.spent;
			});
		})
		.entries(this.raw)
		.map((d) => {
			return { date: new Date(+d.key), spent: d.value };
		});

		this.sumByDay = dataByDay;
		return this.sumByDay;
	};

	getDomainDay() {
		if (this.domainDay)
			return this.domainDay;

		const months = this.getMonths();
		const domainDay = [
			Math.min(d3.min(this.getSumByDay(), (d) => { return d.date; }), months[0]) - (1000*60*60*24*5),
			Math.max(d3.max(this.getSumByDay(), (d) => { return d.date; }), months[months.length - 1]) + (1000*60*60*24*5)
		];

		this.domainDay = domainDay;
		return this.domainDay;
	};

	getDomainSpent() {
		if (this.domainSpent)
			return this.domainSpent;

		const domainSpent = d3.extent(this.getSumByDay(), (d) => { return d.spent; });

		this.domainSpent = domainSpent;
		return this.domainSpent;
	};
	
	parseDataBlob(data) {
		return d3.csvParse(data, (d) => {
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
			};
		});
	};

	generateEnum(data) {
		if (!data || data.length < 1)
			throw 'generateEnum data passed is either undefined or empty';

		const fields = [];
		for (let key in Object.keys(data[0])) {
			fields.push(key);
		}
		return fields;
	};
};

export default Data;