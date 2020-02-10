//MutiAttribColor

var vsShaderSrc = 
' attribute vec4 a_Position;\n' +
' void main() {\n' + 
' gl_Position = a_Position;\n' +
' }\n';

var fsShaderSrc = 
 
' precision mediump float; \n' + 
' uniform float u_Width;\n' +
' uniform float u_Height; \n' + 
' void main() {\n' +
' gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, gl_FragCoord.y/u_Height,1.0);\n' + 
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
	
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
	0.0, 0.5, 
	-0.5, -0.5,
	0.5, -0.5
	]);
	var n = 3;
	
	var vertexBuffer = gl.createBuffer();
	
	if(!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}
	
	 
	// write vertex coordinate to the buffer object and enable it
	
						 
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position < 0) {
		console.log('Failed to load the storage location of a_Position');
		return -1;
	}
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(a_Position);
	
	var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
	if(u_Width < 0) {
		console.log('Failed to get the storage location of u_Width');
		return -1;
	}
	
	var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
	if(u_Height < 0 ) { 
		console.log('Failed to get the storage location of u_Height.');
		return -1;
	}
	
	gl.uniform1f(u_Width, gl.drawingBufferWidth);
	gl.uniform1f(u_Height,gl.drawingBufferHeight);
	
	 
	// Unbind buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,null);
	return n;
}