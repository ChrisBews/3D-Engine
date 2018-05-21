class ImageLoaderCore {

  private _loadingImages: HTMLImageElement[];
  private _loadingImageUrls: string[];

  constructor() {
    this._loadingImages = [];
    this._loadingImageUrls = [];
  }

  public loadImage(url: string, callback?: (url?: string, image?: HTMLImageElement) => void) {
    const image: HTMLImageElement = new Image();
    image.addEventListener('load', () => {
      this._onImageLoadComplete(url, image, callback);
    });
    image.src = url;
    this._loadingImages.push(image);
    this._loadingImageUrls.push(url);
  }

  private _onImageLoadComplete = (url: string, image: HTMLImageElement, callback?: (url: string, image?: HTMLImageElement) => void) => {
    this._loadingImageUrls.forEach((loadingUrl, index) => {
      if (loadingUrl === url) {
        this._loadingImageUrls.splice(index);
        this._loadingImages.splice(index);
      }
    });
    if (callback) callback(url, image);
  }
}

export const ImageLoader = new ImageLoaderCore();
