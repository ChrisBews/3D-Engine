class TextureShader {

  constructor(imageUrl) {
    this._imageUrl = imageUrl;
    this._gl;
    this._texture;
    this._image;
  }

  get imageUrl() { return this._imageUrl; }
  set imageUrl(value) {
    this._imageUrl = value;
    if (this._gl) this._prepareTexture();
  }

  get texture() { return this._texture; }
  
  get vertexShader() {
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

  get fragmentShader() {
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
      }
    `;
  }

  setGL(value) {
    this._gl = value;
    if (this._imageUrl) this._prepareTexture();
  }

  _prepareTexture() {
    this._texture = this._gl.createTexture();
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
    // Fill the temporary texture with a 1x1 blue pixel
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, 1, 1, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    this._loadImage();
  }

  _loadImage() {
    this._image = new Image();
    this._image.src = this._imageUrl;
    this._image.addEventListener('load', this._onImageLoadComplete.bind(this));
  }

  _onImageLoadComplete() {
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
    this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, this._image);
    this._gl.generateMipmap(this._gl.TEXTURE_2D);
  }
}
