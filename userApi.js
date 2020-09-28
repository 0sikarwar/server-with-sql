const { dbConnection } = require("./database");
const { path } = require("./utils");
const { sendEmail } = require('./emailHelper')
const { v4: uuidv4 } = require('uuid');
const forgotPassHtml = require('./emailHelper/forgotPassHtml')
const registerUser = (req) => {
	const userData = path(["body", "userDocument"], req);
	const { firstName, lastName, loginId, password } = userData;
	const queryString =
    "INSERT INTO userDetails ( email, fname, lname, password ) " +
    `VALUES ('${loginId}', '${firstName}', '${lastName}', '${password}')`;
	return new Promise((resolve) => {
		dbConnection.query(queryString, function (err) {
			if (err) {
				console.log("DB_ERROR" + JSON.stringify(err));
				resolve({
					loginResponseStatus:
            err.code === "ER_DUP_ENTRY" ? "INVALID_REQUEST" : err.code,
				});
			}
				resolve({
					loginResponseStatus: "SUCCESS",
					userData: { email: loginId, firstName: firstName, lastName: lastName },
			})
		});
	});
};

const forgotPass = (req) => {
	const userData = path(["body", "userDocument"], req);
	const { loginId } = userData;
	return new Promise((resolve) => {
		const token = uuidv4();
		const payload = forgotPassHtml.replace(/#link#/g,"https://0sikarwar.github.io/resetPass/"+token)
		sendEmail(loginId, "Reset Password", "html", payload,(emailResp, mailError)=>{
			const queryString =
			`UPDATE userDetails SET token='${token}', tokentype='reset'  WHERE email = '${loginId}'`;
			if(!mailError){
				dbConnection.query(queryString, function (err, DbResp) {
					if (err) {
						console.log("DB_ERROR" + JSON.stringify(err));
						resolve({
							loginResponseStatus: err.code,
						});
						return
					}
					if(!DbResp.affectedRows){
						resolve({
							loginResponseStatus: "INVALID_USER",
							userData: { email: loginId },
							emailResp: "Mail not sent"
						});
						return
					}
						resolve({
							loginResponseStatus: "SUCCESS",
							userData: { email: loginId },
							emailResp: "Mail sent"
						});
				});
				return
			} 
				resolve({
					loginResponseStatus: "FAILURE",
					userData: { email: loginId },
					emailResp: "Mail not sent"
				});
			
		} )
	});
};

const loginUser = (req) => {
	const userData = path(["body", "userDocument"], req);
	const { loginId, password } = userData;
	const queryString =
    "SELECT * from userDetails " + `WHERE email = '${loginId}'`;
	return new Promise((resolve) => {
		dbConnection.query(queryString, function (err, result) {
			if (err) {
				console.log("DB_ERROR" + JSON.stringify(err));
				resolve({ loginResponseStatus: err.code });
			}
			if (!result.length) {
				resolve({ loginResponseStatus: "INVALID_USER" });
			} else if (password !== result[0].password) {
				resolve({ loginResponseStatus: "UN_AUTHORIZED" });
			} else {
				resolve({
					loginResponseStatus: "SUCCESS",
					userData: {
						email: result[0].email,
						firstName: result[0].fname,
						lastName: result[0].lname,
					},
				});
			}
		});
	});
};

module.exports = {
	registerUser,
	loginUser,
	forgotPass
};
