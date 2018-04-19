class ObjLoader {

  constructor(url, callback) {
    this._url = url;
    this._callback = callback;
    this._fetchRequest;
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
    this._parseModelData(true);
  }

  _parseModelData(flipYUV) {
    let line,
    item,
    itemArray,
    i,
    index,
    isQuad = false,
    aCache = [], // Key = itemArray element, value = final index of the vertex
    cVert = [], // Cache vertices read from obj
    cNorm = [], // Cache normal array
    cUV = [], // cache UV array
    fVert = [], // Final index sorted vertex array
    fNorm = [], // Final index sorted normal array
    fUV = [], // Final index sorted UV array
    fIndex = [], // Final sorted UV array
    fIndexCnt = 0, // Final count of unique vertices
    posA = 0,
    posB = this._modelData.indexOf('\n', 0);
    
    while (posB > posA) {
      line = this._modelData.substring(posA, posB).trim();

      switch(line.charAt(0)) {
        case 'v':
          // Cache vertex data for index processing when going through face data
          // Sample data (x, y, z):
          // v -1.000000 1.000000 1.000000
          // vt 0.000000 0.666667
          // vn 0.000000 0.000000 -1.000000
          item = line.split(' ');
          item.shift();
          switch(line.charAt(1)) {
            case ' ':
              // vertex
              cVert.push(parseFloat(item[0]), parseFloat(item[1]), parseFloat(item[2]));
              break;
            case 't':
              // texture co-ord
              cUV.push(parseFloat(item[0]), parseFloat(item[1]));
              break;
            case 'n':
              // normal
              cNorm.push(parseFloat(item[0]), parseFloat(item[1]), parseFloat(item[2]));
              break;
            default:
              break;
          }
          break;
        case 'f':
          // Process face data
          // All index values start at 1, but JavaScript arrays start at 0. So need to
          // always subtract 1 from index to match
          // f 1/1/1 2/2/1 3/3/1 4/4/1
          // f 34/41/36 34/41/35 34/41/36
          // f 34//36 34//35 34//36
          item = line.split(' ');
          item.shift();
          isQuad = false;
          for (let i = 0; i < item.length; i++) {
            // In the event the face is a quad (4 values on a line rather than 3) 0,1,2 2,3,0 (pattern for 2 triangles)
            if (i === 3 && !isQuad) {
              i = 2; // Last vertex in the first triangle is the start of the 2nd triangle in a quad
              isQuad = true; // Don't try continuing a quad again
            }
            // has this vertex data been processed?
            if (item[i] in aCache) {
              fIndex.push(aCache[item[i]]); // It has, add it's index to the list
            } else {
              // New unique vertex data, process it
              itemArray = item[i].split('/');
              // Parse vertex data and save final version ordered correctly by index
              index = (parseInt(itemArray[0])-1) * 3;
              fVert.push(cVert[index] * 10, cVert[index+1] * 10, cVert[index+2] * 10);

              // Parse normal data and save final version ordered correctly by index
              index = (parseInt(itemArray[2])-1) * 3;
              fNorm.push(cNorm[index], cNorm[index+1], cNorm[index+2]);

              // Parse texture data if available and save final version ordered corectly by index
              // Check for blank, as UVs are optional
              if (itemArray[1] !== '') {
                index = (parseInt(itemArray[1])-1) * 2;
                fUV.push(cUV[index], (!flipYUV) ? cUV[index+1] : 1-cUV[index+1]);
              }

              // Cache the vertex item value and it's new index
              // The idea is to create an index for each unique set of vertex data based on the face data
              // So when the same item is found, just add the index value without duplicating vertex/normal/texture
              aCache[item[i]] = fIndexCnt;
              fIndex.push(fIndexCnt);
              fIndexCnt++;
            }

            // In a quad, the last vertex of the second triangle is the first vertex in the first triangle
            if (i === 3 && isQuad) fIndex.push(aCache[item[0]]);
          }
        break;
      }

      // Get ready to parse the next line of the obj data
      posA = posB + 1;
      posB = this._modelData.indexOf('\n', posA);
    }

    this._indices = fIndex;
    this._vertices = fVert;
    this._normals = fNorm;
    this._uvs = fUV;

    if (this._callback) this._callback(this._indices, this._vertices, this._normals, this._uvs);
  }
}