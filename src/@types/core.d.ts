interface IWorld {

}

interface IScene {
  children: IMesh[];
  camera: ICamera;
  lights: ILight[];
  directionalLight: IDirectionalLight;
  onChildAdded: (mesh: IMesh) => void;
  onMeshMaterialUpdated: (mesh: IMesh) => void;
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
