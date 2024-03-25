import BaseComponent from '@app/libs/component/BaseComponent';
import { _decorator, assetManager, Button, director, ImageAsset, Label, Node, Sprite, SpriteFrame, Texture2D } from 'cc';
import JigsawStore from '../../jigsaw/stores/game.store';

const { ccclass, property } = _decorator;

@ccclass('ImageSelector')
export default class ImageSelector extends BaseComponent {
  @property(Button) browseButton: Button = null;
  @property(Button) playButton: Button = null;
  @property(Sprite) previewSprite: Sprite = null;
  @property(Button) nextPieceNoButton: Button = null;
  @property(Button) prevPieceNoButton: Button = null;
  @property(Label) noPieceLabel: Label = null;

  private noPieceArray = [2, 3, 4, 5, 6, 7];
  private currentIndex = 0;

  protected onLoad(): void {
    this.browseButton.node.on(Node.EventType.TOUCH_END, this.onBrowseFile, this);
    this.playButton.node.on(Node.EventType.TOUCH_END, this.goToPlay, this);

    this.addButtonEvent(
      this.nextPieceNoButton,
      () => {
        this.changeNoPiece(this.currentIndex + 1);
      },
      this
    );

    this.addButtonEvent(
      this.prevPieceNoButton,
      () => {
        this.changeNoPiece(this.currentIndex - 1);
      },
      this
    );
  }

  protected start(): void {
    this.changeNoPiece(0);
  }

  private onBrowseFile(): void {
    if (!this.browseButton.interactable) return;
    this.browseImage();
  }

  private goToPlay(): void {
    JigsawStore.Instance.targetImage = this.previewSprite.spriteFrame;
    JigsawStore.Instance.DIM = this.noPieceArray[this.currentIndex];
    director.loadScene('Jigsaw');
  }

  private changeNoPiece(newIndex: number): void {
    if (newIndex < 0 || newIndex >= this.noPieceArray.length) {
      return;
    }

    this.prevPieceNoButton.getComponent(Sprite).grayscale = newIndex === 0;
    this.nextPieceNoButton.getComponent(Sprite).grayscale = newIndex === this.noPieceArray.length - 1;

    this.noPieceLabel.string = `${this.noPieceArray[newIndex] ** 2}`;
    this.currentIndex = newIndex;
  }

  private browseImage(width = 300, height = 300): void {
    const parent = this.node;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event) => {
      // eslint-ignore
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result as string;

          img.onload = (e) => {
            const spriteFrame = new SpriteFrame();
            const texture = new Texture2D();
            const size = Math.min(img.width, img.height);
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
            console.log('cropped', canvas.toDataURL());

            assetManager.loadRemote<ImageAsset>(canvas.toDataURL() as string, { ext: '.png' }, (err, imageAsset) => {
              texture.image = imageAsset;
              spriteFrame.texture = texture;
              console.log('size', spriteFrame.width, spriteFrame.height);
              this.previewSprite.getComponent(Sprite).spriteFrame = spriteFrame;
            });
          };

          // assetManager.loadRemote<ImageAsset>(
          //   e.target.result as string,
          //   { ext: ".png" },
          //   (err, imageAsset) => {
          //     const texture = new Texture2D();
          //     const spriteFrame = new SpriteFrame();
          //     texture.image = imageAsset;
          //     spriteFrame.texture = texture;
          //     this.previewSprite.spriteFrame = spriteFrame;
          //   }
          // );
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  }
}
