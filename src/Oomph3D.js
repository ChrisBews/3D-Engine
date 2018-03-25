class Oomph3D {

  constructor(canvas) {
    this.canvas = canvas;
    this._gl;
    this._scene;
    this._frameTimer;
    this._previousRenderTime = Date.now();
    this._onUpdate;
    this._vao;
    this._resizeFrameRequest;
    this._positionBuffer;
    this._normalsBuffer;
    this._initGL();
    if (this._gl) {
      this._addListeners();
      this._onWindowResized();
    }
  }

  set scene(scene) {
    if (!scene instanceof Scene) {
      console.error('Scene is not valid');
      return;
    }
    this._scene = scene;
    this._scene.glContext = this._gl;
  }

  set onUpdate(callback) {
    this._onUpdate = callback;
    // Start the render loop
    if (callback) {
      this._startFrameTimer();
    } else {
      this._clearFrameTimer();
    } 
  }

  _initGL() {
    this._gl = this.canvas.getContext('webgl2');
    if (!this._gl) {
      console.error('Failed to instantiate WebGL2 context');
      return;
    }
    this._vao = this._gl.createVertexArray();
    this._gl.bindVertexArray(this._vao);
    // Don't render back-facing triangles
    this._gl.enable(this._gl.CULL_FACE);
    // Enable depth buffer (don't show obscured pixels)
    this._gl.enable(this._gl.DEPTH_TEST);
    this._createBuffers();
  }

  _addListeners() {
    window.addEventListener('resize', this._onWindowResized.bind(this));
  }

  _createBuffers() {
    this._positionBuffer = this._gl.createBuffer();
    this._normalsBuffer = this._gl.createBuffer();
  }

  _clearFrameTimer() {
    // Cancel a frame request if one exists
    if (this._frameTimer) {
      cancelAnimationFrame(this._frameTimer);
      this._frameTimer = undefined;
    }
  }

  _startFrameTimer() {
    this._clearFrameTimer();
    // Start a new frame request
    this._frameTimer = requestAnimationFrame(this._update.bind(this));
  }

  _onWindowResized() {
    if (!this._resizeFrameRequest) {
      this._resizeFrameRequest = requestAnimationFrame(this._resizeCanvas.bind(this));
    }
  }

  _resizeCanvas() {
    this._resizeFrameRequest = undefined;
    Helpers.resizeCanvasToDisplay(this._gl.canvas);
    this._gl.viewport(0, 0, this._gl.canvas.clientWidth, this._gl.canvas.clientHeight);
    if (this._scene) {
      this._scene.onWindowResized();
    }
  }

  _update(renderTime) {
    // Convert from milliseconds to seconds
    renderTime *= 0.001;
    // Get the elapsed time
    const timePassed = renderTime - this._previousRenderTime;
    // Store previous render time
    this._previousRenderTime = renderTime;

    // Allow for updates to take place
    if (this._onUpdate) this._onUpdate(timePassed);
    // Draw all children in current scene
    this._draw();
    // Wait for next frame
    this._startFrameTimer();
  }

  _draw() {
    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    const sceneCameraMatrix = this._scene.camera.matrix;

    const meshes = this._scene.children;
    meshes.forEach(mesh => {
      const vertices = mesh.vertices;
      const normals = mesh.normals;
      const material = mesh.material;
      const program = material.program;

      if (program) {
        this._gl.useProgram(program.glProgram);

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._positionBuffer);
        this._gl.enableVertexAttribArray(program.positionLocation);
        this._gl.vertexAttribPointer(program.positionLocation, 3, this._gl.FLOAT, false, 0, 0);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);
        
        const meshMatrix = Matrix3D.multiply(sceneCameraMatrix, mesh.matrix);
        this._gl.uniformMatrix4fv(program.matrixLocation, false, meshMatrix);

        // Protect the normals from world scaling by inverting and transposing the mesh's matrix
        let inverseWorldMatrix = Matrix3D.inverse(mesh.worldMatrix);
        let inverseTransposedWorldMatrix = Matrix3D.transpose(inverseWorldMatrix);
        this._gl.uniformMatrix4fv(program.worldLocation, false, inverseTransposedWorldMatrix);
 
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._normalsBuffer);
        this._gl.enableVertexAttribArray(program.normalsLocation);
        this._gl.vertexAttribPointer(program.normalsLocation, 3, this._gl.FLOAT, false, 0, 0);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, normals, this._gl.STATIC_DRAW);

        this._gl.uniform4fv(program.colorLocation, material.shader.color);

        // Apply lighting
        const lightValues = [0, 0, 0];
        let lightColor = [0, 0, 0];
        const totalLights = this._scene.lights.length;

        if (totalLights) {
          this._scene.lights.forEach(light => {
            if (light.isDirectional) {
              const directions = light.direction;
              lightValues[0] += directions[0];
              lightValues[1] += directions[1];
              lightValues[2] += directions[2];
              lightColor = light.color;
            }
          });
          if (totalLights > 1) {
            // Average the light directions
            lightValues[0] = lightValues[0] / totalLights;
            lightValues[1] = lightValues[1] / totalLights;
            lightValues[2] = lightValues[2] / totalLights;
          }
        }
        this._gl.uniform3fv(program.lightDirectionLocation, Matrix3D.normalizeVector(lightValues));
        this._gl.uniform3fv(program.lightColorLocation, lightColor);

        const primitiveType = this._gl.TRIANGLES;
        this._gl.drawArrays(primitiveType, 0, vertices.length / 3);
      } else {
        console.warn(`Mesh ${mesh.id} has no shader assigned, so will not be rendered`);
      }
    });
  }
}