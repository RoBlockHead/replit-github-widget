import { createSVGWindow, config } from 'svgdom';
import {SVG, registerWindow} from '@svgdotjs/svg.js';
import {getUserInfo} from './api.js';
import fs from 'fs';
import appConfig from './config.js';

config
	.setFontDir('./fonts')
	.setFontFamilyMappings({
		'IBM Plex Sans': 'ibm-plex-regular.ttf',
		'IBM Plex Sans-bold': 'ibm-plex-700.ttf'
	})
	.preloadFonts();

let fonts = JSON.parse( fs.readFileSync(process.cwd() + '/fonts/fonts.json', {encoding: "utf-8"}) );
// console.log(globals.window)
// funky stuff to make nodeJS Work with SVG
const window = createSVGWindow();
const document = window.document;
registerWindow(window,document);

const draw = SVG( document.documentElement );

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
	draw.fontface("IBM Plex Sans", "url(\"" + fonts.regular.fontData + "\")");
	draw.fontface("IBM Plex Sans bold", "url(\"" + fonts.bold.fontData + "\")")

		// .rule('@font-face', {
		// 	fontFamily: "'IBM Plex Sans'", 
		// 	src: `url("${fonts.regular.fontData}")`
		// })
		// .rule('@font-face', {
		// 	fontFamily: "'IBM Plex Sans'", 
		// 	src: `url("${fonts.bold.fontData}")`,
		// 	fontWeight: 'bold'
		// });

	// draw replit logo
	draw.image(appConfig.appUrl + '/replitLogoDark.png')
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


export default getUserSVG; 

import {
    DOMParser
} from 'xmldom';
import canvas from 'canvas';
import fetch from 'whatwg-fetch';
import {Canvg, presets} from 'canvg';
console.log(Canvg);
// let preset = {
// 	DOMParser: DOMParser,
// 	fetch: fetch,
// 	createCanvas: canvas.createCanvas,
// 	createImage: canvas.loadImage,
// 	ignoreAnimation: true,
// 	ignoreMouse: true,
// }
let preset = presets.node({
    DOMParser,
    canvas,
    fetch
});



export const svgToPng = async (username, options) => {
	
	try{
		// Canvg.fon
		canvas.registerFont((process.cwd() + "/fonts/ibm-plex-regular.ttf"), { 
			family: 'IBM Plex Sans'
		});
		canvas.registerFont(process.cwd() + "/fonts/ibm-plex-700.ttf", {
			family: 'IBM Plex Sans',
			weight: 700
		});

	let svg = await getUserSVG(username, options);

	await fs.writeFile("test.xml", svg, () => {null;});
	// console.log(svg);
	let can = preset.createCanvas(500,500);
	let ctx = can.getContext('2d');
	// let canvg = Canvg.fromString(ctx, svg, preset);
	// console.log(Canvg.Canvg.fromString);
// 	const yeet = `<svg xmlns="http://www.w3.org/2000/svg" width="495" height="195">
// 	<style type="text/css">
// 		@font-face{
// 		  font-family: "IBM Plex Sans";
// 		  src: url("${fonts.regular.fontData}") format("application/font-woff2");
// 		}
//     </style>
//  <g>
//  <!-- <rect x="0" y="0" width></rect> -->
//   <title>Layer 1</title>
//   <text transform="matrix(1, 0, 0, 1, 0, 0)" id="svg_6" xml:space="preserve" text-anchor="middle" font-family="IBM Plex Sans" font-weight="bold" font-size="48" y="113" x="137.281" stroke-width="0" stroke="#000000" fill="#000000">Plex</text>
//  </g>
//  <defs></defs>
// </svg>`
	let yeet = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:svgjs="http://svgjs.com/svgjs" width="495" height="195">
		<rect width="495" height="195" fill="#0d1529"></rect>
		<image width="112" height="34" href="https://replit-github-widget.roblockhead.repl.co/replitLogoDark.png" x="16" y="146"></image>
		<defs>
			<pattern x="56" y="48" width="100" height="100" patternUnits="userSpaceOnUse" id="SvgjsPattern1000">
				<image width="100" height="100" href=""></image>
			</pattern>
		</defs>
		<circle r="50" cx="406" cy="98" fill="url(#SvgjsPattern1000)"></circle>
		<text y="42.875" x="15" width="314" height="96" font-family="IBM Plex Sans" font-size="25" text-anchor="start" line-height="33" fill="#e1e2e4" >
			<tspan dy="32.5" x="15">Created 63 Repls</tspan>
			<tspan dy="32.5" x="15">Posted 2 times</tspan>
			<tspan dy="32.5" x="15">310 Cycles</tspan>
		</text>
		<text font-family="IBM Plex Sans" font-size="19" font-weight="bold" x="15" y="15" fill="#e1e2e4" svgjs:data="{&quot;leading&quot;:&quot;1.3&quot;}">
			<tspan dy="24.7" x="15" svgjs:data="{&quot;leading&quot;:&quot;1.3&quot;,&quot;newLined&quot;:true}">@RoBlockHead's Replit Stats</tspan>
		</text>
	</svg>`
	const canvg = Canvg.fromString(ctx, yeet, Object.assign({}, preset, {useCORS: false}));
	canvg.render();
	return can.toBuffer();
	}
	catch(err){
		console.error(err);
	}
	
}