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
}

const Helpers = new HelperUtils();