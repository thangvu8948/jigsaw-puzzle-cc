import { SpriteFrame } from 'cc';
import { JigsawPieceType } from '../constants/jigsaw.constants';

export default class JigsawStore {
  private static _instance: JigsawStore = null;

  public static get Instance(): JigsawStore {
    if (!this._instance) {
      this._instance = new JigsawStore();
    }
    return this._instance;
  }

  public targetImage: SpriteFrame = null;
  public targetMatrix: { type: JigsawPieceType; key: number }[] = [];
  public DIM = 3;
}
