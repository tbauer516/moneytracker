const root = './app/';
const fs = require('fs');

module.exports = (app) => {

	// app.get('/', (req, res) => {
	// 	res.render('views/index.njk', indexData);
	// });

	app.get('/data', (req, res) => {
		res.sendFile('/data/mock.csv', { root: root });
	})

	// ============================================
	// 404 in case a path is wrong ================
	// ============================================

	app.get('*', (req, res) => {
		res.status(404).send('<h1>Sorry! That endpoint doesn\'t go anywhere!</h1>');
	});
};