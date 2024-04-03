import { SpriteFrame, resources } from 'cc';

export default class ResourceLoader {
  private static _instance: ResourceLoader = null;
  public static get instance(): ResourceLoader {
    if (!this._instance) {
      this._instance = new ResourceLoader();
    }
    return this._instance;
  }

  loadSpriteFrame(path: string): Promise<SpriteFrame> {
    return new Promise((res, rej) => {
      resources.load(path, SpriteFrame, (err, asset) => {
        if (!err) {
          res(asset);
        }
        rej(err);
      });
    });
  }
}
