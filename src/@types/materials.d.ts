interface IMaterial {
  isTextureMap: boolean;
  vertexShader: string;
  fragmentShader: string;
  program: IProgram;
  colorInUnits?: rgba;
  texture?: WebGLTexture;
  imageUrl?: string;
  image?: HTMLImageElement;
  loadImage?: (callback: (material: IMaterial) => void) => void;
}
