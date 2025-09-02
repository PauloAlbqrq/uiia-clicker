import {resizeCanvas} from './js/resizeCanvas.js'

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); 

// Get the WebGL rendering context
var gl = canvas.getContext('webgl', {antialias: false});

// Vertex shader
var vshader = `
attribute vec4 position;
void main() {
  gl_Position = position;
}`;

// Fragment shader
var fshader = `
precision mediump float;
uniform vec4 color;
void main() {
  gl_FragColor = color;
}`;

// Compile the vertex shader
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vshader);
gl.compileShader(vs);

// Compile the fragment shader
var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fshader);
gl.compileShader(fs);

// Create the WebGL program and use it
var program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

// Log compilation errors, if any
console.log('vertex shader:', gl.getShaderInfoLog(vs) || 'OK');
console.log('fragment shader:', gl.getShaderInfoLog(fs) || 'OK');
console.log('program:', gl.getProgramInfoLog(program) || 'OK');

var position = gl.getAttribLocation(program, 'position')
var color = gl.getUniformLocation(program, 'color')

gl.uniform4f(color, 1, 0, 0, 1)

var vertices = new Float32Array([
	0, 0.5, 0,
	-0.5, -0.5, 0,
	0.5, -0.5, 0
])

var buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
gl.vertexAttribPointer(
	position,
	3,
	gl.FLOAT,
	false,
	0,
	0
)
gl.enableVertexAttribArray(position)

// Set the clear color (black)
gl.clearColor(1.0, 1.0, 1.0, 1.0);

// Clear the canvas
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw points
gl.drawArrays(
  gl.TRIANGLES, // mode
  0,         // starting point
  3          // number of points to draw
);
