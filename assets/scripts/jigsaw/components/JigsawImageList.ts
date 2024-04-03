import JigsawImageListItem from '@app/jigsaw/components/JigsawImageListItem';
import { JigsawImageMode } from '@app/jigsaw/constants/jigsaw.enums';
import { ListItemData } from '@app/jigsaw/constants/jigsaw.types';
import BaseComponent from '@app/libs/component/BaseComponent';
import { Node, Prefab, _decorator, instantiate } from 'cc';

const { ccclass, property } = _decorator;

type ImageItemType = {
  itemType;
  level: number;
};

@ccclass('JigsawImageList')
export default class JigsawImageList extends BaseComponent {
  @property(Prefab) item: Prefab = null;
  @property(Node) listContainer: Node = null;

  protected start(): void {
    const list: ListItemData[] = [];
    list.push({ level: 1, imageMode: JigsawImageMode.Level });
    list.push({ level: 2, imageMode: JigsawImageMode.Level });
    list.push({ level: 3, imageMode: JigsawImageMode.Level });

    this.render(list);
  }

  render(list: ListItemData[]) {
    this.listContainer.removeAllChildren();
    list.forEach((data) => {
      const node = instantiate(this.item);
      const cpn = node.getComponent(JigsawImageListItem);
      cpn.setData(data);
      node.setParent(this.listContainer);
    });
  }
}
