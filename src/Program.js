class Program {

  constructor(glContext, shader) {
    this._gl = glContext;
    this._vertexShader = this._createShader(this._gl.VERTEX_SHADER, shader.vertexShader);
    this._fragmentShader = this._createShader(this._gl.FRAGMENT_SHADER, shader.fragmentShader);
    this._glProgram = this._createGLProgram();
    
    this._positionLocation;
    this._normalsLocation;
    this._colorLocation;
    this._matrixLocation;
    this._worldMatrixLocation;

    this._getAttributeLocations();
    this._getUniformLocations();
  }

  get positionLocation() {
    return this._positionLocation;
  }

  get normalsLocation() {
    return this._normalsLocation;
  }

  get colorLocation() {
    return this._colorLocation;
  }

  get lightDirectionLocation() {
    return this._lightDirectionLocation;
  }

  get lightColorLocation() {
    return this._lightColorLocation;
  }

  get matrixLocation() {
    return this._matrixLocation;
  }

  get worldLocation() {
    return this._worldMatrixLocation;
  }
  
  get glProgram() {
    return this._glProgram;
  }

  _createShader(type, source) {
    const shader = this._gl.createShader(type);
    this._gl.shaderSource(shader, source);
    this._gl.compileShader(shader);
    const success = this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    console.error('Error compiling shader:', this._gl.getShaderInfoLog(shader));
    this._gl.deleteShader(shader);
  }

  _createGLProgram() {
    const program = this._gl.createProgram();
    this._gl.attachShader(program, this._vertexShader);
    this._gl.attachShader(program, this._fragmentShader);
    this._gl.linkProgram(program);
    const success = this._gl.getProgramParameter(program, this._gl.LINK_STATUS);
    if (success) {
      return program;
    }
    console.error('Error compiling program:', this._gl.getProgramInfoLog(program));
    this._gl.deleteProgram(program);
  }

  _getAttributeLocations() {
    this._positionLocation = this._gl.getAttribLocation(this._glProgram, 'a_position');
    this._normalsLocation = this._gl.getAttribLocation(this._glProgram, 'a_normal');
  }

  _getUniformLocations() {
    this._colorLocation = this._gl.getUniformLocation(this._glProgram, 'u_color');
    this._matrixLocation = this._gl.getUniformLocation(this._glProgram, 'u_matrix');
    this._worldMatrixLocation = this._gl.getUniformLocation(this._glProgram, 'u_worldMatrix');
    this._lightDirectionLocation = this._gl.getUniformLocation(this._glProgram, 'u_reverseLightDirection');
    this._lightColorLocation = this._gl.getUniformLocation(this._glProgram, 'u_lightColor');
  }
}