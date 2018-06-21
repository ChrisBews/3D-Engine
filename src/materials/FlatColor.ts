import { BaseMaterial } from '@oomph3d/materials/BaseMaterial';
import { convertColorToUnits } from '@oomph3d/utils/colorUtils';

export class FlatColor extends BaseMaterial {

  public vertexShader: string = `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;

    // Uniforms
    uniform mat4 u_matrix;
    uniform mat4 u_worldMatrix;

    out vec3 v_normal;

    void main() {
      gl_Position = u_matrix * a_position;

      // Ignore translation when working with normals
      v_normal = mat3(u_worldMatrix) * a_normal;
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
      // As v_normal is a varying, it wont be a unit vector.
      // Normalising it will make it a unit vector again
      vec3 normal = normalize(v_normal);

      // Compute the light by taking the dot product
      // of the normal and the light's reverse direction
      float light = dot(normal, u_reverseLightDirection);

      outColor = u_color;

      // Multiply the colour portion (not alpha) by the light
      outColor.rgb *= light * u_lightColor;
    }
  `;

  private _color: rgba = {r: 0, g: 0, b: 0, a: 1};
  private _colorInUnits: rgba = {r: 0, g: 0, b: 0, a: 1};

  constructor(color: rgb | rgba) {
    super();
    if (!color['a']) color['a'] = 1;
    this._color = color as rgba;
    this._colorInUnits = convertColorToUnits(color);
  }

  get color(): rgb | rgba { return this._color; }
  set color(value: rgb | rgba) {
    if (!value['a']) value['a'] = 1;
    this._color = value as rgba;
    this._colorInUnits = convertColorToUnits(value);
  }

  get colorInUnits(): rgba { return this._colorInUnits; }
}
