export class Program {

  private _vertexShader: WebGLShader;
  private _fragmentShader: WebGLShader;
  private _glProgram: WebGLProgram;
  private _positionAttribute: number;
  private _normalAttribute: number;
  private _uvAttribute: number;
  private _colorUniform: WebGLUniformLocation;
  private _matrixUniform: WebGLUniformLocation;
  private _normalMatrixUniform: WebGLUniformLocation;
  private _lightDirectionUniform: WebGLUniformLocation;
  private _lightColorUniform: WebGLUniformLocation;

  constructor(glContext: WebGLRenderingContext, vertexShader: string, fragmentShader: string) {
    this._vertexShader = this._createShader(glContext, glContext.VERTEX_SHADER, vertexShader);
    this._fragmentShader = this._createShader(glContext, glContext.FRAGMENT_SHADER, fragmentShader);
    this._glProgram = this._createGLProgram(glContext);
  }

  get positionAttribute(): number { return this._positionAttribute; }
  get normalAttribute(): number { return this._normalAttribute; }
  get uvAttribute(): number { return this._uvAttribute; }

  get colorUniform(): WebGLUniformLocation { return this._colorUniform; }
  get matrixUniform(): WebGLUniformLocation { return this._matrixUniform; }
  get normalMatrixUniform(): WebGLUniformLocation { return this._normalMatrixUniform; }
  get lightDirectionUniform(): WebGLUniformLocation { return this._lightDirectionUniform; }
  get lightColorUniform(): WebGLUniformLocation { return this._lightColorUniform; }

  get glProgram() { return this._glProgram; }

  private _createShader(glContext: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader: WebGLShader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);
    const success: boolean = glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);
    if (success) return shader;
    const error: string = `Program: Error compiling shader: ${glContext.COMPILE_STATUS}`;
    glContext.deleteShader(shader);
    throw new Error(error);
  }

  private _createGLProgram(glContext: WebGLRenderingContext): WebGLProgram {
    const program: WebGLProgram = glContext.createProgram();
    glContext.attachShader(program, this._vertexShader);
    glContext.attachShader(program, this._fragmentShader);
    glContext.linkProgram(program);
    const success: boolean = glContext.getProgramParameter(program, glContext.LINK_STATUS);
    if (success) return program;
    const error: string = `Program: Error compiling program: ${glContext.getProgramInfoLog(program)}`;
    glContext.deleteProgram(program);
    throw new Error(error);
  }

  private _getAttributeLocations(glContext: WebGLRenderingContext) {
    this._positionAttribute = glContext.getAttribLocation(this._glProgram, 'a_position');
    this._normalAttribute = glContext.getAttribLocation(this._glProgram, 'a_normal');
    this._uvAttribute = glContext.getAttribLocation(this._glProgram, 'a_texcoord');
  }

  private _getUniformLocations(glContext: WebGLRenderingContext) {
    this._colorUniform = glContext.getUniformLocation(this._glProgram, 'u_color');
    this._matrixUniform = glContext.getUniformLocation(this._glProgram, 'u_matrix');
    this._normalMatrixUniform = glContext.getUniformLocation(this._glProgram, 'u_worldMatrix');
    this._lightDirectionUniform = glContext.getUniformLocation(this._glProgram, 'u_reverseLightDirection');
    this._lightColorUniform = glContext.getUniformLocation(this._glProgram, 'u_lightColor');
  }
}
