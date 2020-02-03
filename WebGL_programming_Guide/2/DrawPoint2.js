//DrawPoint.js
// vertex 

var vsShaderSrc = 
' attribute vec4 a_Position;\n' +
' void main() {\n' +
' gl_Position = a_Position;\n' + // set coordinate
' gl_PointSize = 10.0;\n' + // set point size
'}\n';

var fsShaderSrc = 
   
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the point color
  '}\n'

function main(){
	var canvas = document.getElementById("webgl");
	if(!canvas){
		console.log('Failed to retrieve the <canvas> element');
		return false;
	}
	var gl = getWebGLContext(canvas);
	if(!gl){
		console.log('Failed to get the WebGL context');
		return;
	}
	
	// init shader
	if(!initShaders(gl, vsShaderSrc,fsShaderSrc)) {
		console.log('Failed to load shader');
		return;
	}
	
	//  get attribute 
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position < 0) {
		console.log('Failed to get the a_Position');
		return;
	}
	
	gl.vertexAttrib3f(a_Position,0.0, 0.0, 0.0);
	
	// set color 
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS,0,1);
}