import { instantiate, NodePool, Prefab } from "cc";

class JigsawPieceFactory {
  piecePool: NodePool = new NodePool();

  private poolSize = 10;

  init(prefab: Prefab): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.piecePool.put(instantiate(prefab));
    }
  }
}

const jigsawPieceFactory = new JigsawPieceFactory();
export default jigsawPieceFactory;
