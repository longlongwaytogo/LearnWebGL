//DrawPoint.js
// vertex 
var vsShaderSrc = 
' void main() {\n' +
' gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // set coordinate
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
	
	// set color 
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS,0,1);
}