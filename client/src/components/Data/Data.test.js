import net from '../../net';
import Data from './Data';

let data;

beforeEach(() => {
	return net.fetchEndpoint('/data', 'text').then(rawData => {
		data = new Data(rawData);
		return data;
	});
});

describe('the Data object', () => {
	
	it('holds an array internally', () => {
		expect(typeof data.raw).toEqual('object');
		expect(data.raw instanceof Array).toBe(true);
	});

	it('returns an array of milliseconds, one for each month where data exists', () => {
		const months = data.getMonths();
		let lastMonth = months[0];
		for (let i = 1; i < months.length; i++) {
			expect(months[i]).not.toBe(lastMonth);
			lastMonth = months[i];
		}
	});

	it('returns a sum per day so one day has one data point', () => {
		const sum = data.getSumByDay();
		const sumSorted = sum.sort((a, b) => { return a.date.getTime() - b.date.getTime(); });
		let last = sumSorted[0].date;
		for (let i = 1; i < sumSorted.length; i++) {
			expect(sumSorted[i].date).not.toEqual(last);
			last = sumSorted[i].date;
		}
	});

	it('returns an array of size two, with a min and max value respectively for time by day', () => {
		const domainDay = data.getDomainDay();
		expect(domainDay.length).toEqual(2);
		expect(domainDay[0]).toBeLessThanOrEqual(domainDay[1]);
	});

	it('returns an array of size two, with a min and max value respectively for money spent by day', () => {
		const domainSpent = data.getDomainSpent();
		expect(domainSpent.length).toEqual(2);
		expect(domainSpent[0]).toBeLessThanOrEqual(domainSpent[1]);
	});

});