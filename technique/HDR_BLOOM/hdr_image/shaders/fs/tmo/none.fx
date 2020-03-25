uniform sampler2D tHDR; //hdr图片
//uniform sampler2D tLuminanceMap; //亮度图
uniform float fExposure;
uniform float fGamma;

varying vec2 vUv;

void main(void) {
  vec4 color = texture2D(tHDR, vUv);
 // float luminance = texture2D(tLuminanceMap, vUv).x;
  gl_FragColor = vec4(pow(fExposure * color.xyz, vec3(1.0 / fGamma)), 1.0);
}
