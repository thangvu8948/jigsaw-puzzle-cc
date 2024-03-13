import { _decorator, Component, randomRangeInt } from "cc";

import { JigsawPieceType } from "../constants/jigsaw.constants";
import Cell from "../models/Cell";
import Tile from "../models/Tile";

const { ccclass, property } = _decorator;

@ccclass("JigsawMapGenerator")
export default class JigsawMapGenerator extends Component {
}
