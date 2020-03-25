# WebGL Programming Guide 

author: Kouichi Matsuda  Rodger Lea
translator: xieguanglei
概要：
	本书涵盖WebGL.0API

# 章节：
1. WebGL概述								[2020/1/26]
2. webGL入门								[2020/1/26]
3. 绘制和变换三角形						 
4. 高级变换和动画基础
5. 颜色和纹理
6. OpenGL ES着色语言（GLSL ES）
7. 进入三维世界
8. 光照
9. 层次模型
10. 高级技术 
11. 附录A：WebGL无须交换缓冲区
12. 附录B:GLSL ES1.0 内置函数
13. 附录C:投影矩阵
14. 附录D：WebGl/OpenGL坐标系
15. 附录E:逆转置矩阵
16. 附录F:从文件加载着色器
17. 附录G:世界坐标系和本地坐标系
18. 附录H:关于WebGL浏览器设置

[作者网站](https://sites.google.com/site/webglbook/)
[code](https://sites.google.com/site/webglbook/home/downloads)

**关联阅读：**
 《Opengl es2.0 progaming guide》
[goolge webgl examples](https://code.google.com/archive/p/webglsamples)
[goolge webgl examples_github](https://github.com/WebGLSamples/WebGLSamples.github.io)
[web](https://webglsamples.org/)
[webgl 1.0 spec](https://www.khronos.org/registry/webgl/specs/latest/1.0/)
[webglfundamentals](https://webglfundamentals.org/webgl/lessons/zh_cn/)
[webgl wiki](https://www.khronos.org/webgl/wiki/Main_Page)



学习笔记：

## 1. WebGL概述

OpenGL OpenGL ES WebGL关系

	OpenGL1.5-----〉OpenGL2.0-----〉OpenGL3.3---〉OpenGL4.3
		|子集				|子集		|子集
		|				|			|
	  OpenGL ES <--> OpenGL ES---〉OpenGL ES
	   1.1     不兼容    2.0   兼容    3.0
						|              |
						|			   |
					WebGL1.0        webGL2.0
## 2. WebGL入门
[DrawingRectangle.html](2/DrawingRectangle.html)
[ColorPoints.html](2/ColorPoints.html)
[DrawPoint1.html](2/DrawPoint1.html)
[DrawPoint2.html](2/DrawPoint2.html)
[ClickedPoints.html](2/ClickedPoints.html)

## 3. 绘制和变换三角形
[MultiPoint.html](3/MultiPoint.html) 
[HelloTriangle.html](3/HelloTriangle.html)
[RotateTriangle.html](RotateTriangle.html) 
[RotateTriangle_Matrix.html](3/RotateTriangle_Matrix.html)
[TranslatedTriangle.html](TranslatedTriangle.html)


## 4. 高级变换和动画基础
[RoatingTriangle.html](4/RoatingTriangle.html)

# 10. 高级技术
[Shadow.html](10/Shadow.html)
[Shadow_texture2DProj.html](10/Shadow_texture2DProj.html)
[Shadow_highp.html](10/Shadow_highp.html) 	



OpenGL 其他知识：
1.mipmap：
[纹理映射Mipmap](https://my.oschina.net/sweetdark/blog/177812)
[mipmap与高级纹理查询函数](https://blog.csdn.net/weixin_41254969/article/details/78757369?utm_source=blogxgwz5)

2. opengl与glsl版本
GLSL Versions

OpenGL Version	GLSL Version
2.0	110
2.1	120
3.0	130
3.1	140
3.2	150
3.3	330
4.0	400
4.1	410
4.2	420
4.3	430
GLSL ES Versions (Android, iOS, WebGL)

OpenGL ES has its own Shading Language, and the versioning starts fresh. It is based on OpenGL Shading Language version 1.10.

OpenGL ES Version	GLSL ES Version
2.0	100
3.0	300
So, for example, if a feature is available in GLSL 120, it probably won't be available in GLSL ES 100 unless the ES compiler specifically allows it.
[OpenGL, OpenGL ES, WebGL, GLSL, GLSL ES APIs Table](http://web.eecs.umich.edu/~sugih/courses/eecs487/common/notes/APITables.xml)
[OpenGL 与 GLSL 版本](https://blog.csdn.net/ym19860303/article/details/44115135?utm_source=blogxgwz3)

3. blur 
[mipmap and blur](https://github.com/mattdesl/lwjgl-basics/wiki/ShaderLesson5) 
[OpenGL-ES-Blurs](https://github.com/mattdesl/lwjgl-basics/wiki/OpenGL-ES-Blurs)

4. OpenGLES 
 [GLSL 详解（基础篇）](https://colin1994.github.io/2017/11/11/OpenGLES-Lesson04/)
 [GLSL 详解（高级篇）](https://colin1994.github.io/2017/11/12/OpenGLES-Lesson05/)
 [WebGL - GLSL_ES 着色器语言](https://blog.csdn.net/ithanmang/article/details/91434075)
 
5. [别人学习webgl programming guide的例子](https://github.com/ChowBu/webgl-programming-guide-/tree/master/ch10)