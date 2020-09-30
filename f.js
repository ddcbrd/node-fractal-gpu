function kernel(settings) {
  const { context, constants } = settings;
  const uploadValue_maxIt = constants.maxIt;
const uploadValue_width = constants.width;
const uploadValue_height = constants.height;
const uploadValue_boundary = constants.boundary;

  const gl = context || require('gl')(1, 1);

  const glVariables0 = gl.getExtension('STACKGL_resize_drawingbuffer');
  const glVariables1 = gl.getExtension('STACKGL_destroy_context');
  const glVariables2 = gl.getExtension('OES_texture_float');
  const glVariables3 = gl.getExtension('OES_texture_float_linear');
  const glVariables4 = gl.getExtension('OES_element_index_uint');
  const glVariables5 = gl.getExtension('WEBGL_draw_buffers');
  const glVariable6 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, glVariable6);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.enable(gl.SCISSOR_TEST);
  gl.viewport(0, 0, 2494, 2495);
  const glVariable7 = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(glVariable7, `precision lowp float;
precision lowp int;
precision lowp sampler2D;

attribute vec2 aPos;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;
uniform vec2 ratio;

void main(void) {
  gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);
  vTexCoord = aTexCoord;
}`);
  gl.compileShader(glVariable7);
  const glVariable8 = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(glVariable8, `precision lowp float;
precision lowp int;
precision lowp sampler2D;

const int LOOP_MAX = 600;

ivec3 uOutputDim = ivec3(6220800, 1, 1);
ivec2 uTexSize = ivec2(2494, 2495);

varying vec2 vTexCoord;

float acosh(float x) {
  return log(x + sqrt(x * x - 1.0));
}

float sinh(float x) {
  return (pow(2.718281828459045, x) - pow(2.718281828459045, -x)) / 2.0;
}

float asinh(float x) {
  return log(x + sqrt(x * x + 1.0));
}

float atan2(float v1, float v2) {
  if (v1 == 0.0 || v2 == 0.0) return 0.0;
  return atan(v1 / v2);
}

float atanh(float x) {
  x = (x + 1.0) / (x - 1.0);
  if (x < 0.0) {
    return 0.5 * log(-x);
  }
  return 0.5 * log(x);
}

float cbrt(float x) {
  if (x >= 0.0) {
    return pow(x, 1.0 / 3.0);
  } else {
    return -pow(x, 1.0 / 3.0);
  }
}

float cosh(float x) {
  return (pow(2.718281828459045, x) + pow(2.718281828459045, -x)) / 2.0; 
}

float expm1(float x) {
  return pow(2.718281828459045, x) - 1.0; 
}

float fround(highp float x) {
  return x;
}

float imul(float v1, float v2) {
  return float(int(v1) * int(v2));
}

float log10(float x) {
  return log2(x) * (1.0 / log2(10.0));
}

float log1p(float x) {
  return log(1.0 + x);
}

float _pow(float v1, float v2) {
  if (v2 == 0.0) return 1.0;
  return pow(v1, v2);
}

float tanh(float x) {
  float e = exp(2.0 * x);
  return (e - 1.0) / (e + 1.0);
}

float trunc(float x) {
  if (x >= 0.0) {
    return floor(x); 
  } else {
    return ceil(x);
  }
}

vec4 _round(vec4 x) {
  return floor(x + 0.5);
}

float _round(float x) {
  return floor(x + 0.5);
}

const int BIT_COUNT = 32;
int modi(int x, int y) {
  return x - y * (x / y);
}

int bitwiseOr(int a, int b) {
  int result = 0;
  int n = 1;
  
  for (int i = 0; i < BIT_COUNT; i++) {
    if ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {
      result += n;
    }
    a = a / 2;
    b = b / 2;
    n = n * 2;
    if(!(a > 0 || b > 0)) {
      break;
    }
  }
  return result;
}
int bitwiseXOR(int a, int b) {
  int result = 0;
  int n = 1;
  
  for (int i = 0; i < BIT_COUNT; i++) {
    if ((modi(a, 2) == 1) != (modi(b, 2) == 1)) {
      result += n;
    }
    a = a / 2;
    b = b / 2;
    n = n * 2;
    if(!(a > 0 || b > 0)) {
      break;
    }
  }
  return result;
}
int bitwiseAnd(int a, int b) {
  int result = 0;
  int n = 1;
  for (int i = 0; i < BIT_COUNT; i++) {
    if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
      result += n;
    }
    a = a / 2;
    b = b / 2;
    n = n * 2;
    if(!(a > 0 && b > 0)) {
      break;
    }
  }
  return result;
}
int bitwiseNot(int a) {
  int result = 0;
  int n = 1;
  
  for (int i = 0; i < BIT_COUNT; i++) {
    if (modi(a, 2) == 0) {
      result += n;    
    }
    a = a / 2;
    n = n * 2;
  }
  return result;
}
int bitwiseZeroFillLeftShift(int n, int shift) {
  int maxBytes = BIT_COUNT;
  for (int i = 0; i < BIT_COUNT; i++) {
    if (maxBytes >= n) {
      break;
    }
    maxBytes *= 2;
  }
  for (int i = 0; i < BIT_COUNT; i++) {
    if (i >= shift) {
      break;
    }
    n *= 2;
  }

  int result = 0;
  int byteVal = 1;
  for (int i = 0; i < BIT_COUNT; i++) {
    if (i >= maxBytes) break;
    if (modi(n, 2) > 0) { result += byteVal; }
    n = int(n / 2);
    byteVal *= 2;
  }
  return result;
}

int bitwiseSignedRightShift(int num, int shifts) {
  return int(floor(float(num) / pow(2.0, float(shifts))));
}

int bitwiseZeroFillRightShift(int n, int shift) {
  int maxBytes = BIT_COUNT;
  for (int i = 0; i < BIT_COUNT; i++) {
    if (maxBytes >= n) {
      break;
    }
    maxBytes *= 2;
  }
  for (int i = 0; i < BIT_COUNT; i++) {
    if (i >= shift) {
      break;
    }
    n /= 2;
  }
  int result = 0;
  int byteVal = 1;
  for (int i = 0; i < BIT_COUNT; i++) {
    if (i >= maxBytes) break;
    if (modi(n, 2) > 0) { result += byteVal; }
    n = int(n / 2);
    byteVal *= 2;
  }
  return result;
}

vec2 integerMod(vec2 x, float y) {
  vec2 res = floor(mod(x, y));
  return res * step(1.0 - floor(y), -res);
}

vec3 integerMod(vec3 x, float y) {
  vec3 res = floor(mod(x, y));
  return res * step(1.0 - floor(y), -res);
}

vec4 integerMod(vec4 x, vec4 y) {
  vec4 res = floor(mod(x, y));
  return res * step(1.0 - floor(y), -res);
}

float integerMod(float x, float y) {
  float res = floor(mod(x, y));
  return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);
}

int integerMod(int x, int y) {
  return x - (y * int(x / y));
}

float divWithIntCheck(float x, float y) {
  if (floor(x) == x && floor(y) == y && integerMod(x, y) == 0.0) {
    return float(int(x) / int(y));
  }
  return x / y;
}

float integerCorrectionModulo(float number, float divisor) {
  if (number < 0.0) {
    number = abs(number);
    if (divisor < 0.0) {
      divisor = abs(divisor);
    }
    return -(number - (divisor * floor(divWithIntCheck(number, divisor))));
  }
  if (divisor < 0.0) {
    divisor = abs(divisor);
  }
  return number - (divisor * floor(divWithIntCheck(number, divisor)));
}
// Here be dragons!
// DO NOT OPTIMIZE THIS CODE
// YOU WILL BREAK SOMETHING ON SOMEBODY'S MACHINE
// LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME
const vec2 MAGIC_VEC = vec2(1.0, -256.0);
const vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);
const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536
float decode32(vec4 texel) {
  texel *= 255.0;
  vec2 gte128;
  gte128.x = texel.b >= 128.0 ? 1.0 : 0.0;
  gte128.y = texel.a >= 128.0 ? 1.0 : 0.0;
  float exponent = 2.0 * texel.a - 127.0 + dot(gte128, MAGIC_VEC);
  float res = exp2(_round(exponent));
  texel.b = texel.b - 128.0 * gte128.x;
  res = dot(texel, SCALE_FACTOR) * exp2(_round(exponent-23.0)) + res;
  res *= gte128.y * -2.0 + 1.0;
  return res;
}

float decode16(vec4 texel, int index) {
  int channel = integerMod(index, 2);
  if (channel == 0) return texel.r * 255.0 + texel.g * 65280.0;
  if (channel == 1) return texel.b * 255.0 + texel.a * 65280.0;
  return 0.0;
}

float decode8(vec4 texel, int index) {
  int channel = integerMod(index, 4);
  if (channel == 0) return texel.r * 255.0;
  if (channel == 1) return texel.g * 255.0;
  if (channel == 2) return texel.b * 255.0;
  if (channel == 3) return texel.a * 255.0;
  return 0.0;
}

vec4 legacyEncode32(float f) {
  float F = abs(f);
  float sign = f < 0.0 ? 1.0 : 0.0;
  float exponent = floor(log2(F));
  float mantissa = (exp2(-exponent) * F);
  // exponent += floor(log2(mantissa));
  vec4 texel = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;
  texel.rg = integerMod(texel.rg, 256.0);
  texel.b = integerMod(texel.b, 128.0);
  texel.a = exponent*0.5 + 63.5;
  texel.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;
  texel = floor(texel);
  texel *= 0.003921569; // 1/255
  return texel;
}

// https://github.com/gpujs/gpu.js/wiki/Encoder-details
vec4 encode32(float value) {
  if (value == 0.0) return vec4(0, 0, 0, 0);

  float exponent;
  float mantissa;
  vec4  result;
  float sgn;

  sgn = step(0.0, -value);
  value = abs(value);

  exponent = floor(log2(value));

  mantissa = value*pow(2.0, -exponent)-1.0;
  exponent = exponent+127.0;
  result   = vec4(0,0,0,0);

  result.a = floor(exponent/2.0);
  exponent = exponent - result.a*2.0;
  result.a = result.a + 128.0*sgn;

  result.b = floor(mantissa * 128.0);
  mantissa = mantissa - result.b / 128.0;
  result.b = result.b + exponent*128.0;

  result.g = floor(mantissa*32768.0);
  mantissa = mantissa - result.g/32768.0;

  result.r = floor(mantissa*8388608.0);
  return result/255.0;
}
// Dragons end here

int index;
ivec3 threadId;

ivec3 indexTo3D(int idx, ivec3 texDim) {
  int z = int(idx / (texDim.x * texDim.y));
  idx -= z * int(texDim.x * texDim.y);
  int y = int(idx / texDim.x);
  int x = int(integerMod(idx, texDim.x));
  return ivec3(x, y, z);
}

float get32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  int index = x + texDim.x * (y + texDim.y * z);
  int w = texSize.x;
  vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
  vec4 texel = texture2D(tex, st / vec2(texSize));
  return decode32(texel);
}

float get16(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  int index = x + texDim.x * (y + texDim.y * z);
  int w = texSize.x * 2;
  vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
  vec4 texel = texture2D(tex, st / vec2(texSize.x * 2, texSize.y));
  return decode16(texel, index);
}

float get8(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  int index = x + texDim.x * (y + texDim.y * z);
  int w = texSize.x * 4;
  vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
  vec4 texel = texture2D(tex, st / vec2(texSize.x * 4, texSize.y));
  return decode8(texel, index);
}

float getMemoryOptimized32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  int index = x + texDim.x * (y + texDim.y * z);
  int channel = integerMod(index, 4);
  index = index / 4;
  int w = texSize.x;
  vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
  vec4 texel = texture2D(tex, st / vec2(texSize));
  if (channel == 0) return texel.r;
  if (channel == 1) return texel.g;
  if (channel == 2) return texel.b;
  if (channel == 3) return texel.a;
  return 0.0;
}

vec4 getImage2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  int index = x + texDim.x * (y + texDim.y * z);
  int w = texSize.x;
  vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
  return texture2D(tex, st / vec2(texSize));
}

float getFloatFromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
  return result[0];
}

vec2 getVec2FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
  return vec2(result[0], result[1]);
}

vec2 getMemoryOptimizedVec2(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  int index = x + (texDim.x * (y + (texDim.y * z)));
  int channel = integerMod(index, 2);
  index = index / 2;
  int w = texSize.x;
  vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
  vec4 texel = texture2D(tex, st / vec2(texSize));
  if (channel == 0) return vec2(texel.r, texel.g);
  if (channel == 1) return vec2(texel.b, texel.a);
  return vec2(0.0, 0.0);
}

vec3 getVec3FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
  return vec3(result[0], result[1], result[2]);
}

vec3 getMemoryOptimizedVec3(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  int fieldIndex = 3 * (x + texDim.x * (y + texDim.y * z));
  int vectorIndex = fieldIndex / 4;
  int vectorOffset = fieldIndex - vectorIndex * 4;
  int readY = vectorIndex / texSize.x;
  int readX = vectorIndex - readY * texSize.x;
  vec4 tex1 = texture2D(tex, (vec2(readX, readY) + 0.5) / vec2(texSize));
  
  if (vectorOffset == 0) {
    return tex1.xyz;
  } else if (vectorOffset == 1) {
    return tex1.yzw;
  } else {
    readX++;
    if (readX >= texSize.x) {
      readX = 0;
      readY++;
    }
    vec4 tex2 = texture2D(tex, vec2(readX, readY) / vec2(texSize));
    if (vectorOffset == 2) {
      return vec3(tex1.z, tex1.w, tex2.x);
    } else {
      return vec3(tex1.w, tex2.x, tex2.y);
    }
  }
}

vec4 getVec4FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  return getImage2D(tex, texSize, texDim, z, y, x);
}

vec4 getMemoryOptimizedVec4(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
  int index = x + texDim.x * (y + texDim.y * z);
  int channel = integerMod(index, 2);
  int w = texSize.x;
  vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
  vec4 texel = texture2D(tex, st / vec2(texSize));
  return vec4(texel.r, texel.g, texel.b, texel.a);
}

vec4 actualColor;
void color(float r, float g, float b, float a) {
  actualColor = vec4(r,g,b,a);
}

void color(float r, float g, float b) {
  color(r,g,b,1.0);
}

void color(sampler2D image) {
  actualColor = texture2D(image, vTexCoord);
}

float modulo(float number, float divisor) {
  if (number < 0.0) {
    number = abs(number);
    if (divisor < 0.0) {
      divisor = abs(divisor);
    }
    return -mod(number, divisor);
  }
  if (divisor < 0.0) {
    divisor = abs(divisor);
  }
  return mod(number, divisor);
}

const float constants_maxIt = 600.0;
const float constants_width = 1920.0;
const float constants_height = 1080.0;
const float constants_boundary = 100.0;
uniform float user_xRangeStart;
uniform float user_xRangeFinish;
uniform float user_yRangeStart;
uniform float user_yRangeFinish;
uniform sampler2D user_c;
ivec2 user_cSize = ivec2(1, 1);
ivec3 user_cDim = ivec3(2, 1, 1);
float kernelResult;

    vec3 hsvtorgb(float h, float s, float v){
        float c = s * v;
        float x = c * (1.0 - abs(mod((h / 60.0), 2.0) - 1.0));
        float m = v - c;
        vec3 color;
        if (0.0 <= h && h < 60.0)           color = vec3(c, x, 0.0);
        else if (60.0 <= h && h < 120.0)    color = vec3(x, c, 0.0);
        else if (120.0 <= h && h < 180.0)   color = vec3(0.0, c, x);
        else if (180.0 <= h && h < 240.0)   color = vec3(0.0, x, c);
        else if (240.0 <= h && h < 300.0)   color = vec3(x, 0.0, c);
        else if (300.0 <= h && h < 360.0)   color = vec3(c, 0.0, x);
        color.r = (color.r + m) * 65535.0;
        color.g = (color.g + m) * 65535.0;
        color.b = (color.b + m) * 65535.0;
        return color;
    }
float complexArg(vec2 user_z) {
float user_arg=atan2(user_z[1], user_z[0]);
if ((((user_z[0]<0.0)&&(user_z[1]>=0.0))||((user_z[0]<0.0)&&(user_z[1]<0.0)))) {
user_arg+=3.141592653589793;
}
else if (((user_z[0]>=0.0)&&(user_z[1]<0.0))) {
user_arg+=(3.141592653589793*2.0);
}

return user_arg;
}
float complexAbs(vec2 user_z) {
return sqrt(((user_z[0]*user_z[0])+(user_z[1]*user_z[1])));
}
vec2 complexSq(vec2 user_z) {
float user_re=((user_z[0]*user_z[0])-(user_z[1]*user_z[1]));
float user_im=((2.0*user_z[0])*user_z[1]);
return vec2(user_re, user_im);
}
vec2 complexAdd(vec2 user_z1, sampler2D user_z2,ivec2 user_z2Size,ivec3 user_z2Dim) {
float user_re=(user_z1[0]+getMemoryOptimized32(user_z2, user_z2Size, user_z2Dim, 0, 0, 0));
float user_im=(user_z1[1]+getMemoryOptimized32(user_z2, user_z2Size, user_z2Dim, 0, 0, 1));
return vec2(user_re, user_im);
}
void kernel() {
float user_index=floor(divWithIntCheck(float(threadId.x), 3.0));
float user_colorIndex=integerCorrectionModulo(float(threadId.x),3.0);
float user_x=floor(integerCorrectionModulo(user_index,constants_width));
float user_y=floor(divWithIntCheck(user_index, constants_width));
float user_a=(divWithIntCheck(((user_xRangeFinish-user_xRangeStart)*user_x), (constants_width-1.0))+user_xRangeStart);
float user_b=(divWithIntCheck(((user_yRangeFinish-user_yRangeStart)*user_y), (constants_height-1.0))+user_yRangeStart);
vec2 user_z=vec2(user_a, user_b);
int user_i=0;
float user_maxit=constants_maxIt;
for (int user_n=0;(user_n<int(user_maxit));user_n++){
user_z=complexAdd(complexSq(user_z), user_c,user_cSize,user_cDim);if ((complexAbs(user_z)>constants_boundary)) {
break;
}
user_i++;}

float user_h=divWithIntCheck(complexArg(user_z), (2.0*3.141592653589793));
float user_s=sqrt(divWithIntCheck(float(user_i), constants_maxIt));
kernelResult = hsvtorgb((user_s*360.0), user_h, 1.0)[int(user_colorIndex)];return;
}
void main(void) {
  index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
  threadId = indexTo3D(index, uOutputDim);
  kernel();
  gl_FragData[0][0] = kernelResult;

}`);
  gl.compileShader(glVariable8);
  const glVariable9 = gl.getShaderParameter(glVariable7, gl.COMPILE_STATUS);
  const glVariable10 = gl.getShaderParameter(glVariable8, gl.COMPILE_STATUS);
  const glVariable11 = gl.createProgram();
  gl.attachShader(glVariable11, glVariable7);
  gl.attachShader(glVariable11, glVariable8);
  gl.linkProgram(glVariable11);
  const glVariable12 = gl.createFramebuffer();
  const glVariable13 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, glVariable13);
  gl.bufferData(gl.ARRAY_BUFFER, 64, gl.STATIC_DRAW);
  const glVariable14 = new Float32Array([-1,-1,1,-1,-1,1,1,1]);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, glVariable14);
  const glVariable15 = new Float32Array([0,0,1,0,0,1,1,1]);
  gl.bufferSubData(gl.ARRAY_BUFFER, 32, glVariable15);
  const glVariable16 = gl.getAttribLocation(glVariable11, 'aPos');
  gl.enableVertexAttribArray(glVariable16);
  gl.vertexAttribPointer(glVariable16, 2, gl.FLOAT, false, 0, 0);
  const glVariable17 = gl.getAttribLocation(glVariable11, 'aTexCoord');
  gl.enableVertexAttribArray(glVariable17);
  gl.vertexAttribPointer(glVariable17, 2, gl.FLOAT, false, 0, 32);
  gl.bindFramebuffer(gl.FRAMEBUFFER, glVariable12);
  gl.useProgram(glVariable11);
  const glVariable18 = gl.createTexture();
  gl.activeTexture(33985);
  gl.bindTexture(gl.TEXTURE_2D, glVariable18);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2494, 2495, 0, gl.RGBA, gl.FLOAT, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, glVariable18, 0);
  glVariables0.resize(2494, 2495);
/** start of injected functions **/
function flattenTo(array, target) {
    if (/*utils.*/isArray(array[0])) {
      if (/*utils.*/isArray(array[0][0])) {
        if (/*utils.*/isArray(array[0][0][0])) {
          /*utils.*/flatten4dArrayTo(array, target);
        } else {
          /*utils.*/flatten3dArrayTo(array, target);
        }
      } else {
        /*utils.*/flatten2dArrayTo(array, target);
      }
    } else {
      target.set(array);
    }
  }
function flatten2dArrayTo(array, target) {
    let offset = 0;
    for (let y = 0; y < array.length; y++) {
      target.set(array[y], offset);
      offset += array[y].length;
    }
  }
function flatten3dArrayTo(array, target) {
    let offset = 0;
    for (let z = 0; z < array.length; z++) {
      for (let y = 0; y < array[z].length; y++) {
        target.set(array[z][y], offset);
        offset += array[z][y].length;
      }
    }
  }
function flatten4dArrayTo(array, target) {
    let offset = 0;
    for (let l = 0; l < array.length; l++) {
      for (let z = 0; z < array[l].length; z++) {
        for (let y = 0; y < array[l][z].length; y++) {
          target.set(array[l][z][y], offset);
          offset += array[l][z][y].length;
        }
      }
    }
  }
function isArray(array) {
    return !isNaN(array.length);
  }
  const renderOutput = function (array, width)  {
    const xResults = new Float32Array(width);
    let i = 0;
    for (let x = 0; x < width; x++) {
      xResults[x] = array[i];
      i += 4;
    }
    return xResults;
  };
/** end of injected functions **/
  const innerKernel = function (xRangeStart, xRangeFinish, yRangeStart, yRangeFinish, c) {
    /** start setup uploads for kernel values **/
    const uploadValue_xRangeStart = xRangeStart;
    
    const uploadValue_xRangeFinish = xRangeFinish;
    
    const uploadValue_yRangeStart = yRangeStart;
    
    const uploadValue_yRangeFinish = yRangeFinish;
    
    const uploadValue_c = new Float32Array(4);
    flattenTo(c, uploadValue_c);
    
    /** end setup uploads for kernel values **/
    gl.useProgram(glVariable11);
    gl.scissor(0, 0, 2494, 2495);
    const glVariable19 = gl.getUniformLocation(glVariable11, 'ratio');
    gl.uniform2f(glVariable19, 1, 1);
    const glVariable20 = gl.getUniformLocation(glVariable11, 'user_xRangeStart');
    gl.uniform1f(glVariable20, uploadValue_xRangeStart);
    const glVariable21 = gl.getUniformLocation(glVariable11, 'user_xRangeFinish');
    gl.uniform1f(glVariable21, uploadValue_xRangeFinish);
    const glVariable22 = gl.getUniformLocation(glVariable11, 'user_yRangeStart');
    gl.uniform1f(glVariable22, uploadValue_yRangeStart);
    const glVariable23 = gl.getUniformLocation(glVariable11, 'user_yRangeFinish');
    gl.uniform1f(glVariable23, uploadValue_yRangeFinish);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, glVariable6);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.FLOAT, uploadValue_c);
    const glVariable24 = gl.getUniformLocation(glVariable11, 'user_c');
    gl.uniform1i(glVariable24, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, glVariable12);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    const glVariable25 = new Float32Array(24890120);
    gl.readPixels(0, 0, 2494, 2495, gl.RGBA, gl.FLOAT, glVariable25);
    
    if (!context) { gl.getExtension('STACKGL_destroy_context').destroy(); }
    
    return renderOutput(glVariable25, 6220800);
  };
  return innerKernel;
}