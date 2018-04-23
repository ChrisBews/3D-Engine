class ObjLoader {

  constructor(url, callback) {
    this._url = url;
    this._callback = callback;
    this._fetchRequest;
    this._tempVertices = [];
    this._tempUVs = [];
    this._tempNormals = [];
    this._tempIndices = [];
    this._finalVertices = [];
    this._finalUVs = [];
    this._finalNormals = [];
    this._finalIndices = [];
    this._currentFaceIndex = 0;

    this._indices = [];
    this._vertices = [];
    this._normals = [];
    this._uvs = [];
    this._loadFile();
  }

  _loadFile() {
    this._fetchRequest = fetch(this._url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response.text();
      })
      .then(response => this._onModelLoadComplete(response));
      //.error(error => console.error(error));
  }

  _onModelLoadComplete(data) {
    this._modelData = data.trim() + '\n';
    this._parseModelData();
  }

  _parseModelData() {
    let previousLineBreakIndex = 0,
    lineBreakIndex = this._modelData.indexOf('\n', 0),
    lineToParse = '';

    // While a new line break remains in the file
    while (lineBreakIndex > -1) {
      // Get the next line of the file to check
      lineToParse = this._modelData.substring(previousLineBreakIndex, lineBreakIndex).trim();

      switch(lineToParse.charAt(0)) {
        case 'v':
          this._processVertexLine(lineToParse);
          break;
        case 'f':
          this._processFace(lineToParse);
          break;
        default:
          break;
      }

      previousLineBreakIndex = lineBreakIndex + 1;
      lineBreakIndex = this._modelData.indexOf('\n', previousLineBreakIndex);
    }

    this._indices = this._finalIndices;
    this._vertices = this._finalVertices;
    this._normals = this._finalNormals;
    this._uvs = this._finalUVs;

    if (this._callback) this._callback({
      indices: this._indices,
      vertices: this._vertices,
      normals: this._normals,
      uvs: this._uvs,
    });
  }

  _processVertexLine(lineToParse) {
    // A vertex line can be either vertex position (v), vertex texture (vt), or vertex normal (vn)
    // in the form v(t/n) x y z
    // Split the line on spaces
    const valueArray = lineToParse.split(' ');
    // Remove the v/vt/vn part from the array
    valueArray.shift();
    switch(lineToParse.charAt(1)) {
      case ' ':
        // Vertex position
        this._tempVertices.push(
          parseFloat(valueArray[0]),
          parseFloat(valueArray[1]),
          parseFloat(valueArray[2])
        );
        break;
      case 't':
        // Vertex texture data
        this._tempUVs.push(
          parseFloat(valueArray[0]),
          parseFloat(valueArray[1]),
        );
        break;
      case 'n':
        // Vertex normal
        this._tempNormals.push(
          parseFloat(valueArray[0]),
          parseFloat(valueArray[1]),
          parseFloat(valueArray[2])
        );
        break;
      default:
        break;
    }
  }

  _processFace(lineToParse) {
    // Note that all index values start at 1 in .obj files
    // so we always need to subtract 1 to get zero-indexed values
    // Faces can appear in the following forms
    // (vertex / uv / normal indices)
    // Quad: f 1/1/1 2/2/1 3/3/1 4/4/1
    // Triangle: f 1/1/1 2/2/1 3/3/1
    // Triangle without UVs: f 1//1 2//1 3//1
    const valueArray = lineToParse.split(' ');
    // Remove the 'f' from the array
    valueArray.shift();
    let isQuad = false;
    const previousFaceData = {};
    let index = 0;
    let vertexData;
    // Loop through each vertex in the face (each item is a string like '1/1/1')
    for (let i = 0; i < valueArray.length; i++) {
      // If i == 3, we know this line describes a quad
      if (i === 3 && !isQuad) {
        i = 2; // The last vertex in the 1st triangle is the start of the 2nd triangle
        isQuad = true;
      }
      // Check if this face has already been processed
      if (valueArray[i] in previousFaceData) {
        this._finalIndices.push(previousFaceData[valueArray[i]]);
      } else {
        // New vertex data
        vertexData = valueArray[i].split('/');
        // New index will be vertex index + 3 (x,y,z)
        index = (parseInt(vertexData[0]) - 1) * 3;
        this._finalVertices.push(
          this._tempVertices[index],
          this._tempVertices[index + 1],
          this._tempVertices[index + 2]
        );
        // Do the same for the normals
        index = (parseInt(vertexData[2]) - 1) * 3;
        this._finalNormals.push(
          this._tempNormals[index],
          this._tempNormals[index + 1],
          this._tempNormals[index + 2]
        );
        // And for UVs - but check a value exists first as they're optional
        if (vertexData[1] !== '') {
          index = (parseInt(vertexData[1]) - 1) * 2;
          this._finalUVs.push(
            this._tempUVs[index],
            1 - this._tempUVs[index + 1] // Flip the Y so that Y is upwards to match our WebGL co-ordinate space
          );
        }
        previousFaceData[valueArray[i]] = this._currentFaceIndex;
        this._finalIndices.push(this._currentFaceIndex);
        this._currentFaceIndex++;
      }

      // In a quad, the last vertex of the second triangle is the first vertex in the first triangle
      if (i === 3 && isQuad) {
        this._finalIndices.push(previousFaceData[valueArray[0]]);
      }
    }
  }
}