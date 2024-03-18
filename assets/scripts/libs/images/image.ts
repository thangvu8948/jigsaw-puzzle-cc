import { Texture2D } from "cc";

export function readBase64Async(texture: Texture2D): Promise<string> {
  return new Promise((res, rej) => {
    if (!texture) rej();
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        res(reader.result.toString());
      };
      reader.onerror = function (e) {
        rej(e);
      };
      reader.readAsDataURL(xhr.response);
    };
    // @ts-ignore
    xhr.open("GET", texture.image.nativeUrl);
    xhr.responseType = "blob";
    xhr.send();
  });
}
