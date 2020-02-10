//MutiAttribColor

var vsShaderSrc = 
' attribute vec4 a_Position;\n' +
' attribute float a_PointSize;\n' +
' attribute vec4 a_Color;\n' + 
' varying vec4 v_Color; \n' + 
' void main() {\n' + 
' gl_Position = a_Position;\n' +
' gl_PointSize = a_PointSize;\n' +
' v_Color = a_Color;\n' + 
' }\n';

var fsShaderSrc = 
 
' precision mediump float; \n' + 
' varying vec4 v_Color; \n' + 
' void main() {\n' +
' gl_FragColor = v_Color;\n' + 
'}\n';

function main() {
	var canvas = document.getElementById('webgl');
	
	// Get the rendering contex for webgl
	var gl = getWebGLContext(canvas);
	if(!gl) {
		console.log('Failed to get the rendering context for webGL');
		return;
	}
	
	// Initilize shader
	if(!initShaders(gl,vsShaderSrc,fsShaderSrc)) {
		console.log('Failed to initialize shaders.');
		return;
	}
	
	var n = initVertexBuffers(gl);
	if(n < 0) {
		console.log('Failed to set the position of the vertices');
		return;
	}
	
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.drawArrays(gl.TRIANGLES, 0, n);
	gl.drawArrays(gl.POINTS, 0, n);
	
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
	0.0, 0.5, 10.0,  1.0,0.0,0.0,1.0,
	-0.5, -0.5,20.0, 0.0,1.0,1.0,1.0,
	0.5, -0.5, 30.0, 0.0,0.0,1.0,1.0,
	]);
	var n = 3;
	
	var vertexBuffer = gl.createBuffer();
	
	if(!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}
	
	 
	// write vertex coordinate to the buffer object and enable it
	var FSIZE = vertices.BYTES_PER_ELEMENT;
						 
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position < 0) {
		console.log('Failed to load the storage location of a_Position');
		return -1;
	}
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*7,0);
	gl.enableVertexAttribArray(a_Position);
	
	var a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
	if(a_PointSize < 0) {
		console.log('Failed to load the storage location of a_PointSize');
		retunr -1;
	}
	gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,FSIZE*7,FSIZE*2);
	gl.enableVertexAttribArray(a_PointSize);
	
	
	var a_Color = gl.getAttribLocation(gl.program,'a_Color');
	if(a_Color < 0) {
		console.log('Failed to load the storage location of a_Color');
		retunr -1;
	}
	gl.vertexAttribPointer(a_Color,4,gl.FLOAT,false,FSIZE*7,FSIZE*3);
	gl.enableVertexAttribArray(a_Color);
	
	// Unbind buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,null);
	return n;
}