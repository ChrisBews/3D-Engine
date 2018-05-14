interface IWorld {

}

interface IScene {
  children: IMesh[];
  camera: ICamera;
  lights: ILight[];
  directionalLight: IDirectionalLight;
  update: () => void;
  resize: (canvasWidth: number, canvasHeight: number) => void;
  onChildAdded: (mesh: IMesh) => void;
  onMeshMaterialUpdated: (mesh: IMesh) => void;
  onCameraAdded: (camera: ICamera) => void;
}

interface IProgram {
  positionAttribute: number;
  normalAttribute: number;
  uvAttribute: number;
  colorUniform: WebGLUniformLocation;
  matrixUniform: WebGLUniformLocation;
  normalMatrixUniform: WebGLUniformLocation;
  lightDirectionUniform: WebGLUniformLocation;
  lightColorUniform: WebGLUniformLocation;
  glProgram: WebGLProgram;
}
