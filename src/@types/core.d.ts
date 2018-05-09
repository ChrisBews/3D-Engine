interface IWorld {

}

interface IScene {
  children: IMesh[];
  camera: ICamera;
  lights: ILight[];
  onChildAdded: (mesh: IMesh) => void;
  onMeshMaterialUpdated: (mesh: IMesh) => void;
}

interface IProgram {

}
