require("dotenv").config();
let express = require("express");
let firebase = require("firebase-admin");
let admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");
let twilio = require("twilio");
let app = express();
var cors = require("cors");

//PORT
const PORT = process.env.PORT || 3000;

// use it before all route definitions
app.use(cors());

//Twillo
let accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
let authToken = process.env.AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
let client = new twilio(accountSid, authToken);

//initialize firebase database
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.FIREBASE_DB,
});
let db = firebase.database();
let ref = db.ref();
let usersRef = ref.child("users");

function setCodeToDB(phone, code, messageID) {
	let phoneRef = usersRef.child(phone);
	phoneRef.set({
		verifyCode: code,
		messageID: messageID,
	});
}

app.get("/sendMessage", (req, res, next) => {
	let { phone } = req.query;
	let messageID = 0;

	//Generate random 6 digits code
	let randomCode = 100000 + Math.floor(Math.random() * Math.floor(899999));
	client.messages
		.create({
			body: `Your verify code is: ${randomCode}`,
			to: "+1" + phone, // Text this number
			from: process.env.TWILIO_NUMBER, // From a valid Twilio number
		})
		.then((message) => {
			messageID = message.sid;
			setCodeToDB(phone, randomCode, messageID);
			res.json(message.sid);
		});
});

app.get("/authorize", (req, res, next) => {
	const { phone, code } = req.query;
	let phoneRef = usersRef.child(phone);
	phoneRef.on(
		"value",
		function (snapshot) {
			let data = snapshot.val();
			let isVerified = data.verifyCode.toString() === code.toString();
			res.json(isVerified);
		},
		function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		}
	);
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
