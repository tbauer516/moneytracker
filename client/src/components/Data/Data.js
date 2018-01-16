import * as d3 from 'd3';

class Data {
	constructor(rawDataBlob) {
		this.raw = this.parseDataBlob(rawDataBlob);
		this.fields = this.generateEnum(this.raw);
		this.sumBy = {};
		this.listBy = {};
		this.domainTime = {};
		this.domainSpent = {};
	}

	static day = 1000*60*60*24;

	getListBy(aggregate) {
		let list = this.listBy[aggregate];
		if (list)
			return list;

		const data = this.getSumBy(aggregate);

		list = data.reduce((res, d) => {
			const raw = new Date(d.date);

			raw.setHours(0);
			raw.setMinutes(0);
			raw.setSeconds(0);
			raw.setMilliseconds(0);

			switch (aggregate) {
				case 'year':
					raw.setMonth(0);
				case 'month':
					raw.setDate(1);
			}

			const time = raw.getTime();
			if (res.indexOf(time) === -1)
				res.push(time);

			return res.sort((a, b) => { return a - b; });
		}, []);

		const firstMinus = new Date(list[0]);
		const lastPlus = new Date(list[list.length - 1]);

		this.listBy[aggregate] = list;
		return list;
	}

	getSumBy(aggregate) {
		let aggregatedData = this.sumBy[aggregate];
		if (aggregatedData)
			return aggregatedData;

		aggregatedData = d3.nest()
			.key(d => {
				const aggDate = d.date;
				switch (aggregate) {
					case 'year':
						aggDate.setMonth(0);
					case 'month':
						aggDate.setDate(1);
				}
				
				return aggDate.getTime();
			})
		.rollup(leaves => {
			return d3.sum(leaves, d => {
				return d.spent;
			});
		})
		.entries(this.raw)
		.map(d => {
			return { date: new Date(+d.key), spent: d.value };
		});

		this.sumBy[aggregate] = aggregatedData;
		return aggregatedData;
	}

	getDomainTime(aggregate) {
		let domain = this.domainTime[aggregate];

		if (domain)
			return domain;

		const data = this.getSumBy(aggregate);

		domain = d3.extent(data, d => { return d.date; });
		const max = domain[1];

		switch (aggregate) {
			case 'year':
				max.setMonth(max.getMonth() + 1);
				max.setDate(1);
				break;
			case 'month':
			case 'day':
				max.setDate(max.getDate() + 1);
				break;
		}

		this.domainTime[aggregate] = domain;
		return domain;
	}

	getDomainSpent(aggregate) {
		let domain = this.domainSpent[aggregate];

		if (domain)
			return domain;

		const data = this.getSumBy(aggregate);

		domain = d3.extent(data, d => { return d.spent; });
		domain[0] = 0;

		this.domainSpent[aggregate] = domain;
		return domain;
	}
	
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
	}

	generateEnum(data) {
		if (!data || data.length < 1)
			throw 'generateEnum data passed is either undefined or empty';

		const fields = [];
		for (let key in Object.keys(data[0])) {
			fields.push(key);
		}
		return fields;
	}
}

export default Data;