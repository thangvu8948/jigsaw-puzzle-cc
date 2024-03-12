// private browseImage(width= 300, height= 300): void {

//   const parent = this.node;
//   const fileInput = document.createElement('input');
//       fileInput.type = 'file';
//       fileInput.accept = 'image/*';
//   fileInput.onchange = function (event) {
//           // eslint-ignore
//           const file = event.target.files[0];
//           if (file) {
//             const reader = new FileReader();
//               reader.onload = (e) => {
//                 console.log(e.target.result);
//                 const img = new Image();
//                 img.src = e.target.result as string;

//                 img.onload = function (e) {
//                   const spriteFrame = new SpriteFrame();
//                   const texture = new Texture2D();
//                   const size = width;
//                   const canvas = document.createElement('canvas');
//                   canvas.width = size;
//                   canvas.height = size;
//                   const ctx = canvas.getContext('2d');
//                   ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
//                   console.log('cropped', canvas.toDataURL());

//                   assetManager.loadRemote<ImageAsset>(canvas.toDataURL() as string, {ext: '.png'},  (err, imageAsset) => {
//                     texture.image = imageAsset;
//                     spriteFrame.texture = texture;
//                     find('Canvas/container/Sprite').getComponent(Sprite).spriteFrame = spriteFrame;
//                   });
//                 }

//               }
//               reader.readAsDataURL(file);
//           }
//       };
//   fileInput.click();
// }
