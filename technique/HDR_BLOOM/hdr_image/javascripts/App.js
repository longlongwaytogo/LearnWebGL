// app.js requestAnim shim layer 
//通过检测多个平台的动画循环接口，进行调用一个有效的接口。
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   window.oRequestAnimationFrame ||
		   window.msRequestAnimationFrame ||
		   function(/*function*/ callback,/*DOMElement*/ element) {
			   window.setTimeout(callback,1000/60);
		   };
})();

// 程序主要实现框架
var app = (function(){
	var module = {};
	
	//Private vars
	var stats,container,renderer,
	//Filters
	pngDecoder,
	//WebGL extensions
	glExtFT;
	
	//private functions
	function render(){
		//todo: pass params to Filter#process instead
		module.currentTMO.material.uniforms.fExposure.value = module.settings.exposure;
		module.currentTMO.material.uniforms.fGamma.value = module.settings.gamma;
		
		//Map HDR image to LDR and render result to screen
		module.currentTMO.process(renderer,true);
		
		//Mark end of frame for webGL inspector
		if(glExtFT) glExtFT.frameTerminator();
		
		if(module.statsEnabled) stats.update();
		
	}
	
	function loop() {
		render();
		requestAnimFrame(loop);
	}
		
	// public vars
	module.statsEnabled = true;
	module.tmos = {};
	module.__defineSetter__("currentTMOName",function(tmo) {
		this.currentTMO = this.tmos[tmo];
	});
	
	 module.__defineGetter__("currentTMOName", function () {
        return this.currentTMO.name;
    });
	
	//TMO attributes (common for all TMOs)
	module.settings = {
		exposure: 0.2,
		gamma: 2.2
	};
	
	// public methods
	module.init = function() {
		var self = this; //could just use 'module' instead
		container = document.createElement('div');
		document.body.appendChild(container);
		
		// Stats
		if( this.statsEnabled) {
			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			stats.domElement.style.zIndex =100;
			container.appendChild(stats.domElement);
		}
	
	// load image
	//var pngFile = "http://szimek.github.io/webgl-hdr/images/memorial.png";
	var pngFile = "images/memorial.png";
	var imageTexture = ImageUtils.loadTexture(pngFile,new THREE.UVMapping(),function(image){
		imageTexture.width = image.width;
		imageTexture.height = image.height;
		
		//Renderer
		renderer = new THREE.WebGLRenderer(false);
		renderer.setSize(image.width,image.height);
		container.appendChild(renderer.domElement);
		
            // Enable floating point texture extension
            if ( !renderer.context.getExtension("OES_texture_float") ) {
                alert("Your browser doesn't support required OES_texture_float extension.");
                return;
            }
		// enable 'WebGL inspector' frame termination extensions
		glExtFT = renderer.context.getExtension("GLI_frame_terminator");
		
		// Load all shaders
		ShaderUtils.load(["vs/basic",
		"fs/png_decode","fs/rgb2y",
		"vs/bilateral","fs/bilateral",
		"fs/tmo/none","fs/tmo/Durand02"],
		function(err,shaders) {
			if(err) {
				alert("Couldn't load all shaders");
				return;
			}
			//setup filters
			pngDecoder = new THREE.filters.PNGHDRDecode(imageTexture,shaders);
			self.tmos["none"] = new THREE.filters.NoneTMO(pngDecoder.renderTarget,shaders);
			self.tmos["Durand02"] = new THREE.filters.Durand02TMO(pngDecoder.renderTarget,shaders);
			
			//Decode HDR image file
			pngDecoder.process(renderer);
			
			// set initial tone mapping operator
			//self.currentTMOName = "Durand02";
			self.currentTMOName = "none";
			
			//GUI 
			// 创建一个gui选择对话框 包含none 和 Durand02 选项
			var gui,options;
			gui = new GUI();
			options = Object.keys(self.tmos);
			gui.name("Tone mapping operators");
			gui.add(self,"currentTMOName").name("Seleted TMO").options(options);
			gui.show();
			
			gui = new GUI();
			gui.name("settings");
			gui.add(self.settings,"exposure",
			0,10,0.025).name("Exposure");
			gui.add(self.settings,"gamma",0.1,3,0.1).name("Gamma");
			gui.show();
			//Start render loop
			loop();
		});
	});
	
	imageTexture.min_filter = THREE.LinearFilter;
	imageTexture.mag_filter = THREE.LinearFilter;
	};
	
	return module;
})();

app.init();

	
	
				
	
/* 程序流程分析：
1. requestAnimFrame函数，通过检测多个平台的动画循环接口，进行调用一个有效的接口。
2. app 对象为主要接口，该对象为javascript类，通过函数返回

3. 程序执行主要流程：
 3.1 动态创建div对象，添加到body中，用于绘制程序
 3.2 动态创建Stats对象，添加到body中，用于显示状态信息
 3.3 检测webgl扩展接口是否支持GLI_frame_terminator
 3.4 加载图片，创建imageTexture对象，在image的OnLoad异步执行后，执行一下操作
 3.5 创建THREEJS Renderer对象
 3.6 加载shaders文件，加载异步操作时，执行下一步操作
 3.7 设置两个Filter，None和Durand02作为切换filter
 3.8 Decode HDR image file
 3.9 设置toneMap算法
 3.10 执行渲染循环
 3.11 程序运行，通过调整Gamma和Exposure调整uniform参数
*/
	
	
	
	
	
	