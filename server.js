const express = require('express');
const app = express();

// Server Hosting Code Below

const oneDay = 0; //86400000;
const port = process.env.PORT || 3001;

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static("client/build"));
// }
  

require('./app/routes.js')(app);

app.listen(port, () => {
	console.log(`Application running on port ${port}`);
});