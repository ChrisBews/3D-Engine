import { ImageLoader } from '@oomph3d/loaders/ImageLoader';

export class Texture implements IMaterial {

  private _imageUrl: string;
  private _texture: WebGLTexture;
  private _program: IProgram;
  private _image: HTMLImageElement;

  constructor(imageUrl: string) {
    this._imageUrl = imageUrl;
  }

  get isTextureMap(): boolean { return true; }

  get program(): IProgram { return this._program; }
  set program(value: IProgram) {
    this._program = value;
  }

  get imageUrl(): string { return this._imageUrl; }
  set imageUrl(value: string) {
    this._imageUrl = value;
    this._texture = undefined;
  }

  get image(): HTMLImageElement { return this._image; }

  get texture(): WebGLTexture { return this._texture; }
  set texture(value: WebGLTexture) {
    this._texture = value;
  }

  get vertexShader(): string {
    return `#version 300 es

      in vec4 a_position;
      in vec3 a_normal;
      in vec2 a_texcoord;

      // Uniforms
      uniform mat4 u_matrix;
      uniform mat4 u_worldMatrix;

      out vec3 v_normal;
      out vec2 v_texcoord;

      void main() {
        gl_Position = u_matrix * a_position;

        // Ignore translation when working with normals
        v_normal = mat3(u_worldMatrix) * a_normal;

        v_texcoord = a_texcoord;
      }
    `;
  }

  get fragmentShader(): string {
    return `#version 300 es

      precision mediump float;

      in vec3 v_normal;
      in vec2 v_texcoord;

      uniform vec3 u_reverseLightDirection;
      uniform vec3 u_lightColor;

      uniform sampler2D u_texture;

      out vec4 outColor;

      void main() {
        // As v_normal is a varying, it wont be a unit vector.
        // Normalising it will make it a unit vector again
        vec3 normal = normalize(v_normal);

        // Compute the light by taking the dot product
        // of the normal and the light's reverse direction
        float light = dot(normal, u_reverseLightDirection);

        outColor = texture(u_texture, v_texcoord);

        // Multiply the colour portion (not alpha) by the light
        outColor.rgb *= light * u_lightColor;
      }`;
    }

    public loadImage(callback: (material: IMaterial) => void) {
      ImageLoader.loadImage(this._imageUrl, (url: string, image: HTMLImageElement) => {
        this._image = image;
        callback(this);
      });
    }
  }
