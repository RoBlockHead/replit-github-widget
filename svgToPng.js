import {
    promises as fs
} from 'fs';
import {
    DOMParser
} from 'xmldom';
import canvas from 'canvas';
import fetch from 'node-fetch';
import Canvg, {
    presets
} from 'canvg';

let preset = presets.node({
    DOMParser,
    canvas,
    fetch
});
// export default "";

const svgToPNG = (svg, w, h) => {
	console.log(Canvg);
	let canv = preset.createCanvas(w, h);
	let ctx = canv.getContext('2d');
	const v = Canvg.Canvg.fromString(ctx, svg, preset);
	v.render();
	return canv.toBuffer();
}

export default svgToPNG
// export const getUserPng = async (username, options) => {
// 	document = Canvg.Document
// 	var can = canv.createCanvas(WIDTH, HEIGHT);
// 	var ctx = can.getContext('2d');
// 	console.log(Canvg);
// 	const v = Canvg.Canvg.fromString(ctx, (await getUserSVG(username, options)), preset);
	
// 	v.render();
// 	return can.toDataURL("image/png").split(';base64,')[1];
// }
