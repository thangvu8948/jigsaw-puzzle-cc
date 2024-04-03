import { JigsawLevelPath } from '@app/jigsaw/constants/jigsaw.constants';
import { JigsawImageMode } from '@app/jigsaw/constants/jigsaw.enums';
import { ListItemData } from '@app/jigsaw/constants/jigsaw.types';
import JigsawStore from '@app/jigsaw/stores/game.store';
import BaseComponent from '@app/libs/component/BaseComponent';
import ResourceLoader from '@app/libs/loader/resource-loader';
import { DateFormat, DateFormatter } from '@app/libs/utils/date-formatter';
import { Button, Label, Sprite, _decorator, director, log } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('JigsawImageListItem')
export default class JigsawImageListItem extends BaseComponent {
  @property(Sprite) imgSprite: Sprite = null;
  @property(Label) bestLabel: Label = null;

  private data: ListItemData = null;
  setData(data: ListItemData): void {
    const { imageMode, level } = data;
    this.data = data;
    if (imageMode === JigsawImageMode.Level) {
      this.loadLevelImg(level);
      this.setBestInfo();
    }

    this.addButtonEvent(this.node.getComponent(Button), this.onSelected, this);
  }

  private loadLevelImg(level): void {
    const path = `${JigsawLevelPath}/${level}/spriteFrame`;
    ResourceLoader.instance
      .loadSpriteFrame(path)
      .then((sf) => {
        this.imgSprite.spriteFrame = sf;
      })
      .catch(() => {
        log(`Load level ${level} at ${path} failed`);
      });
  }

  private setBestInfo(): void {
    const { level } = this.data;
    const lastScore = JigsawStore.Instance.getScore(level);
    const hasBest = lastScore >= 0;
    const bestStr = hasBest ? `Best: ${DateFormatter.formatSeconds(lastScore, DateFormat.MM_SS)}` : 'Try now';
    this.bestLabel.string = bestStr;
  }

  private onSelected(): void {
    const { imageMode, level } = this.data;
    JigsawStore.Instance.selectedImageMode = imageMode;
    JigsawStore.Instance.selectedLevel = level;
    director.loadScene('ImageSelection');
  }

  protected onDestroy(): void {}
}
