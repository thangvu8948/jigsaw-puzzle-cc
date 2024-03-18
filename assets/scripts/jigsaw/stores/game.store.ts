import { JigsawPieceType } from '@app/jigsaw/constants/jigsaw.constants';
import { SpriteFrame } from 'cc';

export default class JigsawStore {
  private static _instance: JigsawStore = null;

  public static get Instance(): JigsawStore {
    if (!this._instance) {
      this._instance = new JigsawStore();
    }
    return this._instance;
  }

  public targetImage: SpriteFrame = null;
  public targetMatrix: JigsawPieceType[] = [];
  public DIM = 3;
}
