import { Matrix4 } from './Matrix4';

export const normalizeVector = (vector: vec3): vec3 => {
  const length: number = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  // Don't divide by zero
  if (length > 0.00001) {
    return {
      x: vector.x / length,
      y: vector.y / length,
      z: vector.z / length,
    };
  } else {
    return {x: 0, y: 0, z: 0};
  }
};

export const subtractVectors = (vectorA: vec3, vectorB: vec3): vec3 => {
  return {
    x: vectorA.x - vectorB.x,
    y: vectorA.y - vectorB.y,
    z: vectorA.z - vectorB.z,
  };
};

export const crossVectors = (vectorA: vec3, vectorB: vec3): vec3 => {
  return {
    x: vectorA.y * vectorB.z - vectorA.z * vectorB.y,
    y: vectorA.z * vectorB.x - vectorA.x * vectorB.z,
    z: vectorA.x * vectorB.y - vectorA.y * vectorB.x,
  };
};

export const transformVector = (matrix: Matrix4, vector: vec4): vec4 => {
  const result: number[] = [0, 0, 0, 0];
  const vectorArray: number[] = [vector.x, vector.y, vector.z, vector.w];
  for (let i: number = 0; i < 4; i++) {
    for (let j: number = 0; j < 4; j++) {
      result[i] += vectorArray[j] * matrix.value[j * 4 + i];
    }
  }
  return {
    x: result[0],
    y: result[1],
    z: result[2],
    w: 0,
  };
};
