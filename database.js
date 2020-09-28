const mysql = require("mysql");

const dbConnection = mysql.createConnection({
	host: "remotemysql.com",
	user: "JcYkH69GaA",
	password: "z2lXoUykgO",
	database: "JcYkH69GaA",
	port: "3306",
});
const connectToDb = () => {
	dbConnection.connect(function (err) {
		if (err) throw err;
		console.log("Connected!");
	});
};
module.exports = {
	connectToDb,
	dbConnection,
};
