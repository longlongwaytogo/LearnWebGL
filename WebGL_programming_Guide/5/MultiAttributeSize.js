// MultiAttribSize

var vsShaderSrc = 
' attribute vec4 a_Position;\n' +
' attribute float a_PointSize;\n' +
' void main() {\n' + 
' gl_Position = a_Position;\n' +
' gl_PointSize = a_PointSize;\n' +
' }\n';

var fsShaderSrc = 
' void main() {\n' +
' gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' + 
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
	
	gl.drawArrays(gl.POINTS, 0, n);
	
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
	0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
	var n = 3;
	var sizes = new Float32Array([
	10.0, 20.0, 30.0]);
	
	var vertexBuffer = gl.createBuffer();
	var sizeBuffer = gl.createBuffer();
	if(!vertexBuffer || !sizeBuffer) {
		console.log('Failed to create the buffer object');
		return ;
	}
	
	// write vertex coordinate to the buffer object and enable it
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
	var a_Position = gl.getAttribLocation(gl.program,'a_Position');
	if(a_Position < 0) {
		console.log('Failed to load the storage location of a_Position');
		return;
	}
	gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(a_Position);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, sizes,gl.STATIC_DRAW);
	var a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
	if(a_PointSize < 0) {
		console.log('Failed to load the storage location of a_PointSize');
		retunr ;
	}
	gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(a_PointSize);
	
	// Unbind buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,null);
	return n;
}


	