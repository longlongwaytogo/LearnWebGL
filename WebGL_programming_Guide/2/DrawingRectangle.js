//DrawRectangle.js
function main(){
	var canvas = document.getElementById("example");
	if(!canvas){
		console.log('Failed to retrieve the <canvas> element');
		return false;
	}
	// Get the readering context for 2DCS
	var ctx = canvas.getContext("2d");
	// draw a blue Rectangle
	ctx.fillStyle = 'rgba(0,0,255,1.0)'; // set a blue color
	ctx.fillRect(120,10,150,150);
}