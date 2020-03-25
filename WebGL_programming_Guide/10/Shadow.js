//Shadow.js

var shadow_vs_src = 
' attribute vec4 a_Position;\n' +
' uniform mat4 u_MvpMatrix;\n' + 
' void main() {\n' +
' gl_Position = u_MvpMatrix * a_Position;\n' + 
'}\n';

var shadow_fs_src =
' #ifdef GL_ES\n' +
' precision mediump float;\n' + 
' #endif \n' + 
'void main() { \n' + 
' gl_FragColor = vec4(gl_FragCoord.z,0.0,0.0,1.0);\n' +
'}\n'; 


var vs_src = 
'attribute vec4 a_Position;\n' + 
'attribute vec4 a_Color;\n' + 
'uniform mat4 u_MvpMatrix;\n' +
'uniform mat4 u_MvpMatrixFromLight;\n' + 
'varying vec4 v_PositionFromLight;\n' + 
'varying vec4 v_Color;\n' + 
'void main() { \n' + 
' gl_Position = u_MvpMatrix * a_Position;\n' +
' v_PositionFromLight = u_MvpMatrixFromLight * a_Position;\n' + 
' v_Color = a_Color;\n' + 
'}\n';

var fs_src = 
'#ifdef GL_ES\n' +
'precision mediump float;\n' + 
'#endif\n' +
'uniform sampler2D u_ShadowMap;\n' + 
'varying vec4 v_PositionFromLight;\n' + 
'varying vec4 v_Color;\n' + 
'void main() { \n' + 

//// use texture2D
////--------------------------------------------------------------
' vec3 shadowCoord = (v_PositionFromLight.xyz/v_PositionFromLight.w)/2.0+0.5;\n' +
' vec4 rgbaDepth = texture2D(u_ShadowMap,shadowCoord.xy);\n' + 
' float depth = rgbaDepth.r;\n' + 
' float visibility = (shadowCoord.z > depth + 0.005)?0.7:1.0;\n' + 
////--------------------------------------------------------------
//// use texture2DProj
////--------------------------------------------------------------
// ' mat4 scale_bais_Matrix = mat4(0.5,0.0,0.0,0.0, 0.0,0.5,0.0,0.0, 0.0,0.0,0.5,0.0,0.5,0.5,0.5,1.0);\n' +
 // //'vec4 textureCoords = v_PositionFromLight/2.0+0.5;\n' +  
  // 'vec4 textureCoords = scale_bais_Matrix*v_PositionFromLight;\n' + 
 // ' vec4 rgbaDepth = texture2DProj(u_ShadowMap,textureCoords);\n' + 
 // ' float depth = rgbaDepth.r;\n' + 
 // //' float visibility = (depth < 1.0)?0.7:1.0;\n' + 
  // ' float visibility = (textureCoords.z/textureCoords.w > depth + 0.005 )?0.7:1.0;\n' + 
///--------------------------------------------------------------
' gl_FragColor = vec4(v_Color.rgb*visibility,v_Color.a);\n' + 
//'gl_FragColor =vec4(visibility,0,0,1);\n// rgbaDepth;\n' +
//' gl_FragColor = vec4(1,0,0,1);\n' + 
'}\n';


var OFFSCREEN_WIDTH = 2048,OFFSCREEN_HEIGHT = 2048;
var LIGHT_X = 0, LIGHT_Y = 7, LIGHT_Z = 2; // light position  (pointlight)

function main() {
 // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
   // Initialize shaders for generating a shadow map
  var shadowProgram  = createProgram(gl, shadow_vs_src,shadow_fs_src);
  shadowProgram.a_Position = gl.getAttribLocation(shadowProgram,'a_Position');
  shadowProgram.u_MvpMatrix= gl.getUniformLocation(shadowProgram,'u_MvpMatrix');
  if( shadowProgram.a_Position <0 || !shadowProgram.u_MvpMatrix  ) {
      console.log('Failed to location u_MvpMatrix or u_Position.');
      return;
  } 
 // Initialize shaders for regular drawing
  var normalProgram = createProgram(gl,vs_src,fs_src);
  normalProgram.a_Position = gl.getAttribLocation(normalProgram,'a_Position');
  normalProgram.a_Color = gl.getAttribLocation(normalProgram,'a_Color');
  normalProgram.u_MvpMatrix = gl.getUniformLocation(normalProgram,'u_MvpMatrix');
  normalProgram.u_MvpMatrixFromLight = gl.getUniformLocation(normalProgram,'u_MvpMatrixFromLight');
  normalProgram.u_ShadowMap = gl.getUniformLocation(normalProgram,'u_ShadowMap');

  if(normalProgram.a_Position < 0 || normalProgram.a_Color <0||
    !normalProgram.u_MvpMatrix || !normalProgram.u_MvpMatrixFromLight  ||
    !normalProgram.u_ShadowMap  ) {
    console.log("Failed to location u_Position or u_Color.");
    return;
  }

  var triangle = initVertexBufferForTriangle(gl);
  var plane = initVertexBufferForPlane(gl);

  // set vertex 
  if(!triangle || !plane) {
    console.log("Failed to create object.");
    return;
  }
  
  
  // create fbo
  var fbo = initFramebufferObject(gl);
  if(!fbo) {
    console.log("Faied to init fbo.");
    return;
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D,fbo.texture);

  gl.clearColor(0,0,0,1);
  gl.enable(gl.DEPTH_TEST);

  var viewProjMatrixFromLight = new Matrix4();
  viewProjMatrixFromLight.setPerspective(70.0,OFFSCREEN_WIDTH/OFFSCREEN_HEIGHT,1.0,100.0);
  viewProjMatrixFromLight.lookAt(
    LIGHT_X,LIGHT_Y,LIGHT_Z,
    0.0,0.0,0.0,
    0.0,1.0,0.0);

  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(45.0,canvas.width/canvas.height,1.0,100.0);
  viewProjMatrix.lookAt( 0.0,7.0,9.0,   0.0,0.0,0.0,   0.0,1.0,0.0);

    //viewProjMatrix = viewProjMatrixFromLight;

    
  var currentAngle = 0.0;
  // A model view projection matrix from light source (for triangle)
  var mvpMatrixFromLight_t  = new Matrix4();
  // A model view projection matrix from light source (for plane)
  var mvpMatrixFromLight_p = new Matrix4();
  var tick = function() {
    currentAngle = animate(currentAngle);
   // console.log('currentAngle:' + currentAngle);
      gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
      gl.viewport(0,0,OFFSCREEN_WIDTH,OFFSCREEN_HEIGHT);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    //gl.bindFramebuffer(gl.FRAMEBUFFER,null);
   // gl.viewport(0,0,canvas.clientWidth,canvas.clientHeight);
   // gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shadowProgram);
    drawTriangle(gl,shadowProgram,triangle,currentAngle,viewProjMatrixFromLight);
    mvpMatrixFromLight_t.set(g_mvpMatrix); // used later
    drawPlane(gl,shadowProgram,plane,viewProjMatrixFromLight);
    mvpMatrixFromLight_p.set(g_mvpMatrix);

    //draw general geometry
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    gl.useProgram(normalProgram);
    gl.uniform1i(normalProgram.u_ShadowMap,0);
    gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight,false,mvpMatrixFromLight_t.elements);
    drawTriangle(gl,normalProgram,triangle,currentAngle,viewProjMatrix);
    gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight,false,mvpMatrixFromLight_p.elements);
    drawPlane(gl,normalProgram,plane,viewProjMatrix);
    
    window.requestAnimationFrame(tick,canvas);
  }
  tick();



}


// Coordinate transformation matrix
var g_modelMatrix = new Matrix4();
var g_mvpMatrix = new Matrix4();
function drawTriangle(gl,program,triangle,angle,viewProjMatrix){
  g_modelMatrix.setRotate(angle,0,1,0);
  commDraw(gl,program,triangle,viewProjMatrix);
}

function drawPlane(gl,program,plane,viewProjMatrix){
  g_modelMatrix.setRotate(-45,0,1,1);
  commDraw(gl,program,plane,viewProjMatrix);
}


function commDraw(gl,program,o,viewProjMatrix){
  initAttribVariable(gl,program.a_Position,o.vertexBuffer);
  if(program.a_Color != undefined) 
    initAttribVariable(gl,program.a_Color,o.colorBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,o.indexBuffer);

  // calc model view 
  g_mvpMatrix.set(viewProjMatrix);
  g_mvpMatrix.multiply(g_modelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix,false,g_mvpMatrix.elements);
  //gl.drawElements(gl.TRIANGLES,o.numIndices,o.type,0);
  gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);
}

function initAttribVariable(gl,a_attrib,buffer){

  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.vertexAttribPointer(a_attrib,buffer.num,buffer.type,false,0,0);
  gl.enableVertexAttribArray(a_attrib);
}

function initVertexBufferForPlane(gl){
    // Create a plane
  //  v1------v0
  //  |        | 
  //  |        |
  //  |        |
  //  v2------v3

  var vertices = new Float32Array([ // v0-v1-v2-v3
    3.0, -1.7, 2.5,
    -3.0, -1.7, 2.5,
    -3.0, -1.7, -2.5,
    3.0, -1.7, -2.5   
  ]);
  var colors = new Float32Array([
  1.0, 1.0, 1.0, 
  1.0, 1.0, 1.0, 
  1.0, 1.0, 1.0,  
  1.0, 1.0, 1.0
  ]);

  var indices = new Uint8Array([
    0,1,2,3,0, 2, 3
  ]);

  var o = new Object();
  o.vertexBuffer = initArrayBufferForLaterUse(gl,vertices,3,gl.FLOAT);
  o.colorBuffer = initArrayBufferForLaterUse(gl,colors,3,gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl,indices,gl.UNSIGNED_BYTE);

  if(!o.vertexBuffer|| !o.colorBuffer || !o.indexBuffer) {
    console.log('Failed to create buffer.');
    return null;
  }

  o.numIndices = indices.length;
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

  return o;
}

function initVertexBufferForTriangle(gl) {
  var o = new Object();

    // Create a triangle
  //       v2
  //      / | 
  //     /  |
  //    /   |
  //  v0----v1
  var vertices = new Float32Array([
    -0.8, 3.5,0.0,
    0.8,3.5,0.0,
    0.0,3.5,1.8
  ]);
  var colors = new Float32Array([
    1.0,0.5,0.0,
    1.0,0.5,0.0,
    1.0,0.0,0.0
  ]);
  var indices = new Uint8Array([0,1,2]);

  o.vertexBuffer = initArrayBufferForLaterUse(gl,vertices,3,gl.FLOAT);
  o.colorBuffer = initArrayBufferForLaterUse(gl,colors,3,gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl,indices,gl.UNSIGNED_BYTE);

  if (!o.vertexBuffer || !o.colorBuffer || !o.indexBuffer) return null; 

  o.numIndices = indices.length;

  gl.bindBuffer(gl.ARRAY_BUFFER,null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
  return o;
}


function initArrayBufferForLaterUse(gl, data, num, type) {
  var buffer = gl.createBuffer();
  if(!buffer) {
    console.log('Failed to create buffer.');
    return null;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
   buffer.num = num;

  buffer.type = type;
   return buffer;

}

function initElementArrayBufferForLaterUse(gl,data,type){
  var buffer = gl.createBuffer();
  if(!buffer) {
    console.log("Failed to create buffer.");
    return null;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,data,gl.STATIC_DRAW);
  buffer.type = type;
  return buffer;
}



function initFramebufferObject(gl){
  var framebuffer, texture, depthBuffer;
  var error = function() {
     if(framebuffer)gl.deleteFramebuffer(framebuffer);
     if(texture) gl.deleteTexture(texture);
     if(depthBuffer) gl.deleteRenderbuffer(depthBuffer);
      return null;
    }

    // create fbo
    framebuffer = gl.createFramebuffer();
    if(!framebuffer) {
      console.log('Failed to create frame buffer.');
      return error();
    }

    // create texture
    texture = gl.createTexture();
    if(!texture) {
      console.log('Failed to create texture.');
      return error();
    }
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,OFFSCREEN_WIDTH,OFFSCREEN_HEIGHT,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
															 
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
	 
    depthBuffer = gl.createRenderbuffer();
    if(!depthBuffer) {
      console.log('Failed to create depthbuffer.');
      return error();
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER,depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,OFFSCREEN_WIDTH,OFFSCREEN_HEIGHT);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depthBuffer);

    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(gl.FRAMEBUFFER_COMPLETE !== e) { 
      console.log('check framebuffer status not compelete:' + e.toString());
      return error();
    }

      framebuffer.texture = texture;
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.bindTexture(gl.TEXTURE_2D,null);
      gl.bindRenderbuffer(gl.RENDERBUFFER,null);

      return framebuffer;
  }
   

 






var ANGLE_STEP = 40;
var last = Date.now();

function animate(angle) {
  var now = Date.now();
  var elapsed = now - last;
  last = now;

  var newAngle = angle + (ANGLE_STEP*elapsed)/1000.0;
  return newAngle%360;
}










