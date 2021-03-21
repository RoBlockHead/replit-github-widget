import pkg from 'canvas';
const { createCanvas, registerFont, loadImage } = pkg;
import {numRepls} from './userInfo.js';

const replitLogo = loadImage("./assets/replitLogo.svg");
const __dirname = '/home/runner/replit-github-widget';
process.env.FONTCONFIG_PATH='./fonts';
registerFont((__dirname + "/fonts/ibm-plex-sans-v7-latin-regular.ttf"), { 
	family: 'IBM Plex Sans'
});
registerFont((__dirname + "/fonts/ibm-plex-sans-v7-latin-300.ttf"), { 
	family: 'IBM Plex Sans',
	weight: 300
});
registerFont((__dirname + "/fonts/ibm-plex-sans-v7-latin-500.ttf"), { 
	family: 'IBM Plex Sans',
	weight: 500
});
registerFont((__dirname + "/fonts/ibm-plex-sans-v7-latin-700.ttf"), { 
	family: 'IBM Plex Sans',
	weight: 700
});
const defaultWidth = 1200;

export const getUserImage = async (username, titleText) => {
	if(!titleText) titleText = "I use Replit!"

	const width = 1200;
	const height = 600;

	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, width, height);
	const logo = await replitLogo;
	ctx.drawImage(logo, width-logo.width-25,height-logo.height-25);

	const replCount = await numRepls(username);
	// text = text.data.userByUserName.publicRepls.items.length
	console.log("Creating Image for user " + username);
	ctx.font = 'bold 70pt IBM Plex Sans'
	ctx.textAlign = 'center'
	ctx.fillStyle = '#fff'
	ctx.fillText(titleText, 600, 70)
	ctx.font = '48pt IBM Plex Sans'
	ctx.fillText(`I have created ${replCount} repls!`, 600, 140);
	ctx.fillText(`@${username}`, width/2, height)

	
	return canvas.toDataURL("image/png").split(';base64,')[1];
}