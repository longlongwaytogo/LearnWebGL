//ClickedPoints.js

var vsShaderSrc = 
'attribute vec4 a_Position;\n' +
'void main() {\n' +
' gl_Position = a_Position;\n' + 
' gl_PointSize = 10.0;\n' + 
' }\n';

var fsShaderrSrc = 
'precision mediump float;\n' +
' uniform vec4 u_FragColor;\n' +
' void main(){\n' +
' gl_FragColor = u_FragColor;\n' + 
' }\n';


function main() {
	var canvas = document.getElementById("webgl");
	if(!canvas) {
		console.log('Failed to load canvas');
		return;
	}
	
	var gl = getWebGLContext(canvas);
	
	// init shader
	if(!initShaders(gl, vsShaderSrc,fsShaderrSrc)) {
		console.log('Failed to load Shader!');
		return;
	}
	
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position < 0) {
		console.log('Failed to get the a_Position');
		return;
	}
	gl.vertexAttrib3f(a_Position,0.5,0.0,0.0);
	var u_FragColor = gl.getUniformLocation(gl.program,'u_FragColor');
	
	
	// register mouseclick
	canvas.onmousedown = function(ev) { click(ev,gl,canvas,a_Position,u_FragColor);};
	
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	var g_points = [];
	var g_colors = [];
	function click(ev,gl,canvas,position) {
		var x = ev.clientX;
		var y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
		y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
		g_points.push([x,y]);
		if(x >= 0.0 && y >= 0.0) {
			g_colors.push([1.0,0.0,0.0,1.0]);
		}
		else if(x <0.0 && y < 0.0) {
			g_colors.push([0.0,1.0,0.0,1.0]);
		}
		else {
			g_colors.push([1.0,1.0,1.0,1.0]);
		}
		
		console.log(ev.clientX +','+ev.clientY +',' + rect.left +',' + rect.top +',' + rect.right+ ','+rect.bottom);
		gl.clear(gl.COLOR_BUFFER_BIT);
		var len = g_points.length;
		for(var i = 0; i < len; i++){
			var pos = g_points[i];
			var clr = g_colors[i];
			gl.vertexAttrib3f(a_Position,pos[0],pos[1],0.0);
			gl.uniform4f(u_FragColor,clr[0],clr[1],clr[2],clr[3]);
			gl.drawArrays(gl.POINTS,0,1);
		}
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	