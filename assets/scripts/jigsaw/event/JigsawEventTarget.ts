import { EventTarget } from 'cc';

class JigsawEventTarget extends EventTarget {
  public NAME = 'JigsawEvent';
  public PIECE_HINT = `${this.NAME}_PieceHint`;
  public PIECE_DROP = `${this.NAME}_PieceDrop`;
  public PIECE_RETURN_CONTAINER = `${this.NAME}_PieceReturnContainer`;
}

const jigsawEventTarget = new JigsawEventTarget();
export default jigsawEventTarget;
