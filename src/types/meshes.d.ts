interface IMesh {

}

interface IMeshOptions {
  vertices?: number[];
  normals?: number[];
  indices?: number[];
  uvs?: number[];
}

interface ICubeOptions {
  width: number;
  material: IMaterial;
  x?: number;
  y?: number;
  z?: number;
  height?: number;
  depth?: number;
}
