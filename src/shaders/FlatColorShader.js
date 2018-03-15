class FlatColorShader {

  constructor(color) {
    this._color = color;
  }

  get color() { return this._color; }
  
  get vertexShader() {
    return `#version 300 es
  
      in vec4 a_position;
      in vec3 a_normal;
      in vec4 a_color;

      out vec4 v_color;
      out vec3 v_normal;
      
      void main() {
        gl_Position = a_position;
        v_color = a_color;
      }
    `;
  }

  get fragmentShader() {
    return `#version 300 es
      
      precision mediump float;

      uniform vec4 u_color;

      out vec4 outColor;

      void main() {
        outColor = u_color;
      }
    `;
  }
}
