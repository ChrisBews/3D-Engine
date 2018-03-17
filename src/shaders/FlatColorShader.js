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

      // Uniforms
      uniform mat4 u_matrix;

      out vec4 v_color;
      out vec3 v_normal;
      
      void main() {
        gl_Position = u_matrix * a_position;
        v_color = a_color;
        v_normal = a_normal;
      }
    `;
  }

  get fragmentShader() {
    return `#version 300 es
      
      precision mediump float;

      in vec3 v_normal;

      uniform vec3 u_reverseLightDirection;
      uniform vec4 u_color;

      out vec4 outColor;

      void main() {
        // As v_normal is a varying, it wont be a unit vector.
        // Normalising it will make it a unit vector again
        vec3 normal = normalize(v_normal);

        // Compute the light by taking the dot product
        // of the normal and the light's reverse direction
        float light = dot(normal, u_reverseLightDirection);

        outColor = u_color;

        // Multiply the colour portion (not alpha) by the light
        outColor.rgb *= light;
      }
    `;
  }
}
