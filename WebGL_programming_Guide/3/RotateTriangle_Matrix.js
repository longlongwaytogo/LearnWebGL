// MultiPoints.js

var vsShaderSrc = 
' attribute vec4 a_Position;\n' +
' uniform mat4 u_xTransform;\n' +
 
' void main() {\n' +
' gl_Position = u_xTransform* a_Position;\n' + // set coordinate
 
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
	var u_xTransform = gl.getUniformLocation(gl.program,'u_xTransform');

	  // Note: WebGL is column major order
  var xformMatrix = new Float32Array([
     cosB, sinB, 0.0, 0.0,
    -sinB, cosB, 0.0, 0.0,
      0.0,  0.0, 1.0, 0.0,
      0.0,  0.0, 0.0, 1.0
  ]);
	 // var xtransformMatrix = new Float32Array([
	 // cosB,sinB,0.0,0.0,
	 // -sinB,cosB,0.0,0.0,
	 // 0.0,0.0,1.0,0.0,
	 // 0.0,0.0,0.0,1.0
	 // ]);
	   if (!u_xTransform) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }
  
	gl.uniformMatrix4fv(u_xTransform,false,xformMatrix);
 
	
	
	 
	 
	
	
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