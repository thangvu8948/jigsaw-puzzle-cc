import { JigsawImageMode, JigsawPlayerMode } from '@app/jigsaw/constants/jigsaw.enums';
import { SpriteFrame, sys } from 'cc';
import { JigsawPieceType } from '../constants/jigsaw.constants';
type ScoreDAO = {
  level: number;
  scores: { dim: number; time: number }[];
};
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

  public selectedPlayerMode: JigsawPlayerMode = JigsawPlayerMode.Solo;
  public selectedImageMode: JigsawImageMode = JigsawImageMode.Level;
  public selectedLevel: number = 1;

  saveScore(time: number): void {
    const level = this.selectedLevel;
    const scoresJson = sys.localStorage.getItem('scores');
    const scores: ScoreDAO[] = JSON.parse(scoresJson || '[]');
    const lastScoreInfo: ScoreDAO = scores.find((x) => x.level === this.selectedLevel);

    if (!lastScoreInfo) {
      const newScore: ScoreDAO = {
        level: this.selectedLevel,
        scores: [{ dim: this.DIM, time }]
      };
      scores.push(newScore);
    } else {
      const oldScore = lastScoreInfo.scores.find((x) => x.dim === this.DIM);
      if (oldScore && oldScore.time > time) {
        oldScore.time = time;
      } else if (!oldScore) {
        lastScoreInfo.scores.push({ dim: this.DIM, time });
      }
    }
    sys.localStorage.setItem('scores', JSON.stringify(scores));
  }

  getScore(level: number): number {
    const scoresJson = sys.localStorage.getItem('scores');
    const scores: ScoreDAO[] = JSON.parse(scoresJson || '[]');
    const lastScore = scores.find((x) => x.level === level)?.scores[0].time || -1;
    return lastScore;
  }
}
