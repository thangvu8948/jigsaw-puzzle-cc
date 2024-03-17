import {
  _decorator,
  assetManager,
  Button,
  Component,
  director,
  ImageAsset,
  Node,
  Sprite,
  SpriteFrame,
  Texture2D,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("ImageSelector")
export default class ImageSelector extends Component {
  @property(Button) browseButton: Button = null;
  @property(Button) playButton: Button = null;
  @property(Sprite) previewSprite: Sprite = null;

  protected onLoad(): void {
    this.browseButton.node.on(
      Node.EventType.TOUCH_END,
      this.onBrowseFile,
      this
    );

    this.playButton.node.on(Node.EventType.TOUCH_END, this.goToPlay, this);
  }

  private onBrowseFile(): void {
    if (!this.browseButton.interactable) return;
    this.browseImage();
  }

  private goToPlay(): void {
    window.resultSf = this.previewSprite.spriteFrame;
    director.loadScene("Jigsaw");
  }

  private browseImage(width = 300, height = 300): void {
    const parent = this.node;
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
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
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
              img,
              (img.width - size) / 2,
              (img.height - size) / 2,
              size,
              size,
              0,
              0,
              size,
              size
            );
            console.log("cropped", canvas.toDataURL());

            assetManager.loadRemote<ImageAsset>(
              canvas.toDataURL() as string,
              { ext: ".png" },
              (err, imageAsset) => {
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                console.log("size", spriteFrame.width, spriteFrame.height);
                this.previewSprite.getComponent(Sprite).spriteFrame =
                  spriteFrame;
              }
            );
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
