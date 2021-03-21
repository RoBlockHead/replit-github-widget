// Example Widget
// replit username,
// pfp, numRepls, topLanguages
//
import express from 'express';
import { getUserInfo } from './api.js';
import userSvg, { getUserPng } from './userSVG.js';
import ssap from 'save-svg-as-png';
const { svgAsPngUri } = ssap;
import isbot from 'isbot';
const app = express();
// import { getUserImage } from './imageGen.js';
const DEBUG = true;
// app.set('view engine', 'ejs');
app.use((req, res, next) => {
	res.on('finish', () => {
		console.log(
			`[${getDateString(Date.now())}] ${req.method} ${req.path} - ${
				res.statusCode
			}`
		);
	});
	next();
});
app.use(express.static('./static'));
app.route('/').get((req, res) => {
	// if(DEBUG) res.set({'Content-Type':'image/svg+xml'}).end(userSvg());
	res.sendFile(process.cwd() + '/views/index.html');
});

app.route('/api/user/:username').get(async (req, res) => {
	try {
		// if(req.query.png == "1") {

		// }

		// let imgBuffer = await getUserImage(req.params.username);
		// var img = Buffer.from(imgBuffer, 'base64');

		// ejs.renderFile('views/user.ejs', {
		// 	numRepls: user.replCount,
		// 	cycles: user.cycles,
		// 	postCount: user.postCount,
		// 	pfpURL: user.pfpURL,
		// 	username: req.params.username
		// }, (err, str) => {
		// if(isbot(req.get('user-agent')) || req.query.png == "1"){
		// // if(true){
		// 	// const user = await userSvg(req.params.username, {unStringified: true});
		// 	res.set({
		// 		'Content-Type': 'image/png'
		// 	});

		// 	let img64 = await getUserPng(req.params.username);
		// 	console.log(img64);
		// 	var fullImg = Buffer.from(img64, 'base64');
		// 	res.end(fullImg);
		// }
		// else{
		const user = await userSvg(req.params.username);
		res.set({
			'Content-Type': 'image/svg+xml'
			// 'Content-Length': img.length,
		});
		res.end(user);
		// }
	} catch (err) {
		console.error(err);
		res.status(503).send(err);
	}
});

app.route('/api/repl/:username/:replName').get(async (req, res) => {});
app.listen(3000, app => {
	console.log('listening...');
});

const getDateString = date => {
	let d = new Date(date);
	return `${d.toUTCString()}`;
};
