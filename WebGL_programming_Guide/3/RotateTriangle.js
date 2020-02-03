// MultiPoints.js

var vsShaderSrc = 
' attribute vec4 a_Position;\n' +
' uniform float u_CosB;\n' +
' uniform float u_SinB;\n' +
' void main() {\n' +
' gl_Position.x = a_Position.x * u_CosB - a_Position.y* u_SinB;\n' + // set coordinate
' gl_Position.y = a_Position.x * u_SinB + a_Position.y* u_CosB;\n' + // set coordinate
' gl_Position.z = 0.0;\n' +
' gl_Position .w = 1.0;\n' + 
//' gl_PointSize = 10.0;\n' + // set point size
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
	
	// init vertexarray
	var n = initVertexBuffers(gl);
	if( n < 0) {
		console.log('Failed to set vertexBuffer!');
		return;
	}
	
	var ANGLE = 90;
	
	var radian = Math.PI * ANGLE/ 180.0;
	var cosB = Math.cos(radian);
	var sinB = Math.sin(radian);
	var u_CosB = gl.getUniformLocation(gl.program,'u_CosB');
	var u_SinB = gl.getUniformLocation(gl.program,'u_SinB');
	gl.uniform1f(u_CosB,cosB);
	gl.uniform1f(u_SinB,sinB);
	
	
	 
	 
	
	
	// set color 
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,3);
}

function initVertexBuffers(gl){
	var vertices = new Float32Array([
	0.0,0.5,
	-0.5,-0.5,
	0.5,-0.5]);
	var n = 3; 
	
	// create buffer object
	var vertexBuffer = gl.createBuffer();
	if(!vertexBuffer){
		console.log('Failed to create the buffer object');
		return -1;
	}
	
	// bind buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	// write data to buffer
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position < 0) {
		console.log('failed to find atrrib!');
		return;
	}
	
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
	
	gl.enableVertexAttribArray(a_Position);
	return n;
}