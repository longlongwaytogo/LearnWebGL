//RoatingTriangle

var vsSrc=
' attribute vec4 a_Position;\n' + 
' uniform mat4 u_ModelMatrix;\n' +
' void main() { \n' + 
' gl_Position = u_ModelMatrix * a_Position;\n' + 
' }\n';

var fsSrc= 
' void main() {\n' +
' gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n'+
' }\n';

var ANGLE_STEP = 45.0;

function main() {
	
	var canvas = document.getElementById('webgl');
	
	var gl = getWebGLContext(canvas);
	if(!gl){
		console.log('Failed to get the rendering conext for webgl');
		return ;
	}
	
	if(!initShaders(gl,vsSrc,fsSrc)){
		console.log('Failed to initialize shader.');
		return;
	}
	
	 var n = initVertexBuffers(gl);
	  if (n < 0) {
		console.log('Failed to set the positions of the vertices');
		return;
	  }
	  
	  
	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	var u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix');
	if(!u_ModelMatrix) {
		console.log('Failed to get the storage location of  u_ModelMatrix.');
		return;
	}
	
	var currentAngle = 0.0;
	var modelMatrix = new Matrix4();
	
	var tick = function(){
		
		currentAngle = animate(currentAngle);
		//console.log('currentAngle:'+ currentAngle);
		draw(gl,n,currentAngle,modelMatrix,u_ModelMatrix);
		requestAnimationFrame(tick,canvas);
	}
	tick();
}
	
	  
	function initVertexBuffers(gl) {
		var vertices = new Float32Array ([
		0, 0.5,   -0.5, -0.5,   0.5, -0.5
		]);
		var n = 3;   // The number of vertices

		  // Create a buffer object
		  var vertexBuffer = gl.createBuffer();
		  if (!vertexBuffer) {
			console.log('Failed to create the buffer object');
			return -1;
			}

		  // Bind the buffer object to target
		  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		  // Write date into the buffer object
		  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		  // Assign the buffer object to a_Position variable
		  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
		  if(a_Position < 0) {
			console.log('Failed to get the storage location of a_Position');
			return -1;
		}
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	return n;
}
	 
	 function draw(gl,n,currentAngle,modelMatrix,u_ModelMatrix) {
		 modelMatrix.setRotate(currentAngle,0,0,1);
		 gl.uniformMatrix4fv(u_ModelMatrix,false,modelMatrix.elements);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES,0,n);
	 }
	 
	 var g_last = Date.now();
	 function animate(angle) {
		 var now = Date.now();
		 
		 var elapsed = now - g_last; 
		 	console.log(now,g_last,'elapsed:' + elapsed);
		 g_last = now;
		 
		var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
	
		return newAngle %= 360; 
	 }
	  
	  
	