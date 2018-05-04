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
  height?: number;
  depth?: number;
}

interface ICylinderOptions {
  radius: number;
  material: IMaterial;
  height?: number;
  segments?: number;
  heightSegments?: number;
}

interface ISphereOptions {
  radius: number;
  material: IMaterial;
  segments?: number;
}

interface IFShapeOptions {
  width: number;
  material: IMaterial;
  height?: number;
  depth?: number;
}

interface IPlaneOptions {
  width: number;
  material: IMaterial;
  depth?: number;
  widthDivisions?: number;
  depthDivisions?: number;
}
