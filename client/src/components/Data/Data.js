import * as d3 from 'd3';

class Data {
	constructor(rawDataBlob) {
		this.raw = this._parseDataBlob(rawDataBlob);
		this.fields = this._generateEnum(this.raw);
		this.sum = {};
		this.avg = {};
		this.list = {};
		this.domain = {};
		
	}

	static day = 1000*60*60*24;

	getListByDate(aggregate) {
		if (!this.list.date)
			this.list.date = {};

		let list = this.list.date[aggregate];
		if (list)
			return list;

		const data = this.raw;

		list = data.reduce((res, d) => {
			const raw = new Date(d.date);

			raw.setHours(0);
			raw.setMinutes(0);
			raw.setSeconds(0);
			raw.setMilliseconds(0);

			switch (aggregate) {
				case 'year':
					raw.setMonth(0);
					raw.setDate(1);
					break;
				case 'month':
					raw.setDate(1);
					break;
				default:
					break;
			}

			const time = raw.getTime();
			if (res.indexOf(time) === -1)
				res.push(time);

			return res.sort((a, b) => { return a - b; });
		}, []);

		// const firstMinus = new Date(list[0]);
		// const lastPlus = new Date(list[list.length - 1]);

		// switch (aggregate) {
		// 	case 'year':
		// 		lastPlus.setFullYear(lastPlus.getFullYear() + 1);
		// 		break;
		// 	case 'month':
		// 		lastPlus.setMonth(lastPlus.getMonth() + 1);
		// 		break;
		// 	case 'day':
		// 		lastPlus.setDate(lastPlus.getDate() + 1);
		// 		break;
		// }

		// list.push(lastPlus.getTime());

		this.list.date[aggregate] = list;
		return list;
	}

	getSumSpentByDate(aggregate) {
		return this._getSumByDate('spent', aggregate);
	}

	getSumReceivedByDate(aggregate) {
		return this._getSumByDate('received', aggregate);
	}

	getDomainDate(aggregate) {
		if (!this.domain.date)
			this.domain.date = {};

		let domain = this.domain.date[aggregate];

		if (domain)
			return domain;

		const data = this.raw;

		domain = d3.extent(data, (d) => { return d.date.getTime(); });
		const max = new Date(domain[1]);

		switch (aggregate) {
			case 'year':
				max.setFullYear(max.getFullYear() + 1);
				max.setMonth(0);
				max.setDate(1);
				break;
			case 'month':
				max.setMonth(max.getMonth() + 1);
				max.setDate(1);
				break;
			case 'day':
				max.setDate(max.getDate() + 1);
				break;
			default:
				break;
		}

		domain[1] = max.getTime();

		this.domain.date[aggregate] = domain;
		return domain;
	}

	getDomainSpent(aggregate) {
		return this._getDomainHelperSum('spent', aggregate);
	}

	getDomainReceived(aggregate) {
		return this._getDomainHelperSum('received', aggregate);
	}

	_getAvgByDate(field, aggregate) {
		if (!this.avg[field])
			this.avg[field] = {};

		let aggregatedData = this.avg[field][aggregate];
		if (aggregatedData)
			return aggregatedData;

		aggregatedData = d3.nest()
			.key((d) => {
				const aggDate = d.date;
				switch (aggregate) {
					case 'year':
						aggDate.setMonth(0);
						aggDate.setDate(1);
						break;
					case 'month':
						aggDate.setDate(1);
						break;
					default:
						break;
				}
				
				return aggDate.getTime();
			})
		.rollup((leaves) => {
			return d3.mean(leaves, d => {
				return d[field];
			});
		})
		.entries(this.raw)
		.map(this._mapForChart);

		this.avg[field][aggregate] = aggregatedData;
		return aggregatedData;
	}

	_getSumByDate(field, aggregate) {
		if (!this.sum[field])
			this.sum[field] = {};

		let aggregatedData = this.sum[field][aggregate];
		if (aggregatedData)
			return aggregatedData;

		aggregatedData = d3.nest()
			.key((d) => {
				const aggDate = d.date;
				switch (aggregate) {
					case 'year':
						aggDate.setMonth(0);
						aggDate.setDate(1);
						break;
					case 'month':
						aggDate.setDate(1);
						break;
					default:
						break;
				}
				
				return aggDate.getTime();
			})
		.rollup((leaves) => {
			return d3.sum(leaves, d => {
				return d[field];
			});
		})
		.entries(this.raw)
		.map(this._mapForChart);

		this.sum[field][aggregate] = aggregatedData;
		return aggregatedData;
	}

	_getDomainHelperSum(field, aggregate) {
		if (!this.domain[field])
			this.domain[field] = {};

		let domain = this.domain[field][aggregate];

		if (domain)
			return domain;

		const data = this._getSumByDate(field, aggregate);

		domain = d3.extent(data, (d) => { return d.val; });
		domain[0] = 0;

		this.domain[field][aggregate] = domain;
		return domain;
	}

	_mapForChart(d) {
		return { key: new Date(+d.key), val: d.value };
	}
	
	_parseDataBlob(data) {
		return d3.csvParse(data, (d) => {
			return {
				timestamp: new Date(d.Timestamp),
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

	_generateEnum(data) {
		if (!data || data.length < 1)
			throw new Error('generateEnum data passed is either undefined or empty');

		const fields = [];
		for (let key in Object.keys(data[0])) {
			fields.push(key);
		}
		return fields;
	}
}

export default Data;