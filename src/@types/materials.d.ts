interface IMaterial {
  isTextureMap: boolean;
  vertexShader: string;
  fragmentShader: string;
  program: IProgram;
  colorInUnits?: rgba;
  texture?: WebGLTexture;
}
