export class BaseMaterial implements IMaterial {

  public isTextureMap: boolean = false;

  public vertexShader: string = `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    // Uniforms
    uniform mat4 u_matrix;
    uniform mat4 u_worldMatrix;

    void main() {
      gl_Position = a_position;
      v_normal = a_normal;
    }
  `;

  public fragmentShader: string = `#version 300 es
    precision mediump float;

    in vec3 v_normal;

    uniform vec3 u_reverseLightDirection;
    uniform vec3 u_lightColor;
    uniform vec4 u_color;

    out vec4 outColor;

    void main() {
      outColor = {r: 0, g: 0, b: 0, a: 1};
    }
  `;

  private _program: IProgram;

  constructor() {

  }

  get program(): IProgram { return this._program; }
  set program(value: IProgram) {
    this._program = value;
  }
}
