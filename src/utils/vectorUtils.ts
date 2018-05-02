export const normalizeVector = (vector: vec3): vec3 => {
  const length: number = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
  // Don't divide by zero
  if (length > 0.00001) {
    return {
      x: vector[0] / length,
      y: vector[1] / length,
      z: vector[2] / length,
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

export const transformVector = (matrix: mat4, vector: vec3) : vec3 => {
  const result: number[] = [0, 0, 0, 0];
  for (let i: number = 0; i < 4; i++) {
    for (let j: number = 0; j < 4; j++) {
      result[i] += vector[j] * matrix[j * 4 + i];
    }
  }
  return {
    x: result[0],
    y: result[1],
    z: result[2],
  };
};
