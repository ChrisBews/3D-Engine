class HelperUtils {

  resizeCanvasToDisplay(canvas) {
    const cssToRealPixels = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    const displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      return true;
    }
    return false;
  }

  degreesToRadians(angleInDegrees) {
    return angleInDegrees * Math.PI / 180;
  }

  radiansToDegrees(angleInRadians) {
    return angleInRadians * 180 / Math.PI;
  }

  convertRGBToUnits(r, g, b) {
    return [
      r / 255,
      g / 255,
      b / 255,
      1,
    ];
  }
}

const Helpers = new HelperUtils();