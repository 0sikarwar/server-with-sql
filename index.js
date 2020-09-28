const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const { connectToDb } = require("./database");
const cors = require("cors");
const { registerUser, loginUser, forgotPass } = require("./userApi");

app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../build")));

app.get("/ping", function (req, res) {
	return res.send("pong");
});

app.post("/register", (req, res) => {
	registerUser(req, res).then((obj) => {
		res.json(obj);
	});
});

app.post("/login", (req, res) => {
	loginUser(req, res).then((obj) => {
		res.json(obj);
	});
});
 app.post("/forgotpassword", (req, res) => {
	forgotPass(req, res).then((obj) => {
		res.json(obj);
	});
});

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080, () => {
	console.log("DEV SERVER RUNNING ON: ", process.env.PORT || 8080);
	connectToDb();
});
