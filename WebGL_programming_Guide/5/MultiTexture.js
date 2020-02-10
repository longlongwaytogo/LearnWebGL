//MultiTexture

var vsShaderSrc = 
' attribute vec4 a_Position;\n' + 
' attribute vec2 a_TexCoord; \n' + 
' varying vec2 v_TexCoord; \n' + 
' void main() { \n' + 
' gl_Position = a_Position; \n' + 
' v_TexCoord = a_TexCoord; \n' + 
'}\n';

var fsShaderSrc = 
'precision mediump float; \n' + 
' uniform sampler2D u_Sampler0;\n' + 
' uniform sampler2D u_Sampler1;\n' +
' varying vec2 v_TexCoord;\n' + 
' void main(){\n'+
'  vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n' +
  '  vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +
  '  gl_FragColor = color0 * color1;\n' +
  '}\n';	
  
  function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
    // Initialize shaders
  if (!initShaders(gl, vsShaderSrc, fsShaderSrc)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Set texture
  if (!initTextures(gl, n)) {
    console.log('Failed to intialize the texture.');
    return;
  }
}

function initVertexBuffers(gl) {
  var verticesTexCoords = new Float32Array([
    // Vertex coordinate, Texture coordinate
    -0.5,  0.5,   0.0, 1.0,
    -0.5, -0.5,   0.0, 0.0,
     0.5,  0.5,   1.0, 1.0,
     0.5, -0.5,   1.0, 0.0,
  ]);
  var n = 4; // The number of vertices

  // Create a buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the positions of vertices to a vertex shader
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_TexCoord
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the buffer assignment

  return n;
}

function initTextures(gl,n) {
	// create a texture object
	var tex0 = gl.createTexture();
	var tex1 = gl.createTexture();

	if(!tex0 || !tex1) {
		console.log('Failed to create texture object.');
		return false;
	}
	// get storage location 
	var u_Sampler0 = gl.getUniformLocation(gl.program,'u_Sampler0');
	var u_Sampler1 = gl.getUniformLocation(gl.program,'u_Sampler1');
	if(!u_Sampler0 || !u_Sampler1) {
		console.log('Failed to get location of texture uniform');
		return false;
	}
	var image0 = new Image();
	var image1 = new Image();
	if(!image0 || !image1) {
		console.log('Failed to create Image.');
		return false;
	}
	
	image0.onload = function() { loadTexture(gl,n,tex0,u_Sampler0,image0,0);};
	image1.onload = function() { loadTexture(gl,n,tex1,u_Sampler1,image1,1);};
	
	image0.src='../resources/sky.jpg';
	image1.src='../resources/circle.gif';
	
	return true;
}
// specify whether the texture unit is ready to use
var g_TexUnit0 = false, g_TexUnit1 = false;
function loadTexture(gl,n,texture,u_Sampler,image,texUnit) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1); // Flip the image's y-axis 
	// make the texture unit active
	if(texUnit == 0) {
		gl.activeTexture(gl.TEXTURE0);
		g_TexUnit0 = true;
	}
	else
	{
		gl.activeTexture(gl.TEXTURE1);
		g_TexUnit1 = true;
	}
	gl.bindTexture(gl.TEXTURE_2D,texture);
	
	// set texturew parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
	
	gl.uniform1i(u_Sampler,texUnit);
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	//gl.clear(gl.COLOR_BUFFER_BIT);

	if(g_TexUnit0 && g_TexUnit1) {
		gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
		
	}
}