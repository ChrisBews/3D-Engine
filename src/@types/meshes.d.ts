interface IMesh {
  id: string;
  center: vec3;
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  material: IMaterial;
  matrix: mat4;
  normalsMatrix: mat4;
  vertices: Float32Array;
  normals: Float32Array;
  indices: Uint16Array;
  uvs: Float32Array;
  onMaterialUpdated: (mesh: IMesh) => void;
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
