import { createSVGWindow } from 'svgdom';
import {SVG, registerWindow} from '@svgdotjs/svg.js';
import {getUserInfo} from './api.js';
import * as canvas from 'canvas';
// const {createCanvas, loadImage, createImage} = canv;
import fs from 'fs';
import Canvg, { presets } from 'canvg';
import { DOMParser } from 'xmldom';
import fetch from 'node-fetch';
const preset = presets.node({
    DOMParser,
    canvas,
		fetch
});
import config from './config.js';
// console.log();
let fonts = JSON.parse( fs.readFileSync(process.cwd() + '/fonts/fonts.json', {encoding: "utf-8"}) );

// import htmli from 'htmlimage';
// const {Image} = htmli.HTMLImageElement;

// funky stuff to make nodeJS Work with SVG
const window = createSVGWindow();
const doc = window.document;
registerWindow(window, doc);

const draw = SVG( doc.documentElement );
/** User {
 *   numRepls
 * 	 numPosts
 *   numComments
 *   numCycles
 *   isBanned
 *   image
 *   username
 *   joinDate
 * }
 */
const WIDTH = 495;
const HEIGHT = 195;
const getUserSVG = async (username, options) => {
	let ops = options || {};
	let bgColor = ops.bgColor || "#0D1529";
	let fgColor = ops.fgColor || "#E1E2E4";
	username = username || "util";
	let userInfo = {}
	try{
		 userInfo = await getUserInfo(username);
	}
	catch(err){
		console.log(err);
		userInfo = {
			numRepls: 0,
			numPosts: 0,
			numComments: 0,
			numCycles: 0,
			isBanned: false,
			image: 'https://replit.com/public/images/evalbot/evalbot_28.png',
		}
	}
	// Draw the background color
	draw.rect(495,195).fill(bgColor);

	// add fonts
	draw.style()
		.rule('@font-face', {
			fontFamily: "'IBM Plex Sans'", 
			src: `url("${fonts.regular.fontData}")`
		})
		.rule('@font-face', {
			fontFamily: "'IBM Plex Sans'", 
			src: `url("${fonts.bold.fontData}")`,
			fontWeight: 'bold'
		});

	// draw replit logo
	draw.image(config.appUrl + '/replitLogoDark.svg')
		.size(112,34)
		.move(16,146);

	// image to be generated
	let profPattern = draw.pattern(100,100, (patt) => {
		patt.image(userInfo.image).size(100,100)
		
		// patt.attr({patternContentUnits: 'objectBoundingBox'});
	})

	draw.circle(100)
		.move(356,48)
		.fill(profPattern.move(56,48));

	draw.text((t) => {
		// t.lines.get(0).dy(0);
		t.dy(33);
		let t1 = t.tspan(`Created ${userInfo.numRepls} Repls`).newLine();
		t1.dy(0);
		if(!userInfo.isBanned) {
			t.tspan(`Posted ${userInfo.numPosts} times`).newLine();
			t.tspan(`${userInfo.numCycles} Cycles`).newLine();
		}
		else {
			t.tspan('I am banned').fill('#e00').newLine();t.tspan('from Repl Talk').fill('#e00').newLine();
		}
		// t.node.childNodes[0].dy(0);
		// console.log(t.nodes.childNodes);
	}).ax(15).ay(42.875)
		.size(314,96)
		.font({'family': 'IBM Plex Sans', 'size':'25', 'anchor':'start', 'line-height':'33'})
		.fill(fgColor);
	// if(banned){
	// 	draw.text("BANNED")
	// 		.ax(15).ay(45)
	// 		.font({'family': 'IBM Plex Sans', 'size': '70', 'weight': 'bold'})
	// 		.fill('#FF0000');
	// }

	draw.text(`@${userInfo.error ? "[invalid user]" : username}'s Replit Stats`)
		.font({'family':'IBM Plex Sans','size': '19', 'weight':'bold'})
		.x(15).ay(15)
		.fill(fgColor);
	return draw.svg()
}

export const getUserPng = async (username, options) => {
	document = Canvg.Document
	var can = canv.createCanvas(WIDTH, HEIGHT);
	var ctx = can.getContext('2d');
	console.log(Canvg);
	const v = Canvg.Canvg.fromString(ctx, (await getUserSVG(username, options)), preset);
	
	v.render();
	return can.toDataURL("image/png").split(';base64,')[1];
}

export default getUserSVG; 
// // () => {
// 	return getUserSVG("sdffskdghkdfsdkfjghlsdkfjhlkjcvhlkcjxb");
// }
