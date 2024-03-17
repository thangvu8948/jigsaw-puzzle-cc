export enum JigsawPieceType {
  EMPTY = '',
  CORNER_1_TL = 'c-1-tl',
  CORNER_1_TR = 'c-1-tr',
  CORNER_1_BL = 'c-1-bl',
  CORNER_1_BR = 'c-1-br',

  CORNER_2_TL_1 = 'c-2-tl-1',
  CORNER_2_TR_1 = 'c-2-tr-1',
  CORNER_2_BL_1 = 'c-2-bl-1',
  CORNER_2_BR_1 = 'c-2-br-1',

  CORNER_2_TL_2 = 'c-2-tl-2',
  CORNER_2_TR_2 = 'c-2-tr-2',
  CORNER_2_BL_2 = 'c-2-bl-2',
  CORNER_2_BR_2 = 'c-2-br-2',

  CORNER_3_TL = 'c-3-tl',
  CORNER_3_TR = 'c-3-tr',
  CORNER_3_BL = 'c-3-bl',
  CORNER_3_BR = 'c-3-br',

  EDGE_1_T = 'e-1-t',
  EDGE_1_L = 'e-1-l',
  EDGE_1_R = 'e-1-r',
  EDGE_1_B = 'e-1-b',

  EDGE_2_T = 'e-2-t',
  EDGE_2_L = 'e-2-l',
  EDGE_2_R = 'e-2-r',
  EDGE_2_B = 'e-2-b',

  EDGE_3_T = 'e-3-t',
  EDGE_3_L = 'e-3-l',
  EDGE_3_R = 'e-3-r',
  EDGE_3_B = 'e-3-b',

  EDGE_4_T = 'e-4-t',
  EDGE_4_L = 'e-4-l',
  EDGE_4_R = 'e-4-r',
  EDGE_4_B = 'e-4-b',

  EDGE_5_T_1 = 'e-5-t-1',
  EDGE_5_T_2 = 'e-5-t-2',
  EDGE_5_B_1 = 'e-5-b-1',
  EDGE_5_B_2 = 'e-5-b-2',

  EDGE_5_L_1 = 'e-5-l-1',
  EDGE_5_L_2 = 'e-5-l-2',
  EDGE_5_R_1 = 'e-5-r-1',
  EDGE_5_R_2 = 'e-5-r-2',

  EDGE_6_T_1 = 'e-6-t-1',
  EDGE_6_T_2 = 'e-6-t-2',
  EDGE_6_B_1 = 'e-6-b-1',
  EDGE_6_B_2 = 'e-6-b-2',

  EDGE_6_L_1 = 'e-6-l-1',
  EDGE_6_L_2 = 'e-6-l-2',
  EDGE_6_R_1 = 'e-6-r-1',
  EDGE_6_R_2 = 'e-6-r-2',

  MID_1 = 'm-1-t',
  MID_2 = 'm-2-t',

  MID_3_T = 'm-3-t',
  MID_3_L = 'm-3-l',
  MID_3_R = 'm-3-r',
  MID_3_B = 'm-3-b',

  MID_4_T = 'm-4-t',
  MID_4_L = 'm-4-l',

  MID_5_TL = 'm-5-tl',
  MID_5_TR = 'm-5-tr',
  MID_5_BL = 'm-5-bl',
  MID_5_BR = 'm-5-br'
}

export const CORNERS = [
  JigsawPieceType.CORNER_1_TL,
  JigsawPieceType.CORNER_1_TR,
  JigsawPieceType.CORNER_1_BL,
  JigsawPieceType.CORNER_1_BR,
  JigsawPieceType.CORNER_2_TL_1,
  JigsawPieceType.CORNER_2_TR_1,
  JigsawPieceType.CORNER_2_BL_1,
  JigsawPieceType.CORNER_2_BR_1,
  JigsawPieceType.CORNER_2_TL_2,
  JigsawPieceType.CORNER_2_TR_2,
  JigsawPieceType.CORNER_2_BL_2,
  JigsawPieceType.CORNER_2_BR_2,
  JigsawPieceType.CORNER_3_TL,
  JigsawPieceType.CORNER_3_TR,
  JigsawPieceType.CORNER_3_BL,
  JigsawPieceType.CORNER_3_BR
];

export type JigsawPieceConfig = {
  scale: { x: number; y: number };
  angle?: number;
  widgets: { top?: boolean; bottom?: boolean; right?: boolean; left?: boolean };
  overflow?: {
    top?: boolean;
    bottom?: boolean;
    right?: boolean;
    left?: boolean;
  };
};

export const JIGSAW_PIECE_CONFIGS: Record<JigsawPieceType, JigsawPieceConfig> = {
  [JigsawPieceType.CORNER_1_BL]: {
    scale: { x: -1, y: -1 },
    widgets: { bottom: true, left: true }
  },
  [JigsawPieceType.CORNER_1_TL]: {
    scale: {
      x: -1,
      y: 1
    },
    widgets: {
      top: true,
      bottom: false,
      right: false,
      left: true
    }
  },
  [JigsawPieceType.CORNER_1_TR]: {
    scale: {
      x: 1,
      y: 1
    },
    widgets: {
      top: false,
      bottom: false,
      right: false,
      left: false
    }
  },
  [JigsawPieceType.CORNER_1_BR]: {
    scale: {
      x: 1,
      y: -1
    },
    widgets: {
      top: false,
      bottom: false,
      right: false,
      left: false
    }
  },
  [JigsawPieceType.CORNER_2_TL_1]: {
    scale: {
      x: -1,
      y: 1
    },
    widgets: {
      top: true,
      bottom: false,
      right: false,
      left: true
    },
    overflow: { right: true }
  },
  [JigsawPieceType.CORNER_2_TR_1]: {
    scale: {
      x: 1,
      y: 1
    },
    widgets: {
      top: true,
      bottom: false,
      right: true,
      left: false
    },
    overflow: { left: true }
  },
  [JigsawPieceType.CORNER_2_BL_1]: {
    scale: {
      x: -1,
      y: -1
    },
    widgets: {
      top: false,
      bottom: true,
      right: false,
      left: true
    },
    overflow: { right: true }
  },
  [JigsawPieceType.CORNER_2_BR_1]: {
    scale: {
      x: 1,
      y: -1
    },
    widgets: {
      top: false,
      bottom: true,
      right: true,
      left: false
    },
    overflow: { left: true }
  },

  [JigsawPieceType.CORNER_2_TL_2]: {
    angle: 90,
    scale: {
      x: 1,
      y: 1
    },
    widgets: {
      top: true,
      bottom: false,
      right: false,
      left: true
    },
    overflow: { bottom: true }
  },
  [JigsawPieceType.CORNER_2_TR_2]: {
    angle: 90,
    scale: {
      x: -1,
      y: 1
    },
    widgets: {
      top: true,
      bottom: false,
      right: true,
      left: false
    },
    overflow: { bottom: true }
  },
  [JigsawPieceType.CORNER_2_BL_2]: {
    angle: -90,
    scale: {
      x: -1,
      y: 1
    },
    widgets: {
      top: false,
      bottom: true,
      right: false,
      left: true
    },
    overflow: { top: true }
  },
  [JigsawPieceType.CORNER_2_BR_2]: {
    angle: -90,
    scale: {
      x: 1,
      y: 1
    },
    widgets: {
      top: false,
      bottom: true,
      right: true,
      left: false
    },
    overflow: { top: true }
  },

  //--corner-3
  [JigsawPieceType.CORNER_3_TL]: {
    angle: 90,
    scale: {
      x: 1,
      y: 1
    },
    widgets: {
      top: true,
      bottom: false,
      right: false,
      left: true
    },
    overflow: { bottom: true, right: true }
  },
  [JigsawPieceType.CORNER_3_TR]: {
    angle: 90,
    scale: {
      x: -1,
      y: 1
    },
    widgets: {
      top: true,
      bottom: false,
      right: true,
      left: false
    },
    overflow: { bottom: true, left: true }
  },
  [JigsawPieceType.CORNER_3_BL]: {
    angle: -90,
    scale: {
      x: -1,
      y: 1
    },
    widgets: {
      top: false,
      bottom: true,
      right: false,
      left: true
    },
    overflow: { top: true, right: true }
  },
  [JigsawPieceType.CORNER_3_BR]: {
    angle: -90,
    scale: {
      x: 1,
      y: 1
    },
    widgets: {
      top: false,
      bottom: true,
      right: true,
      left: false
    },
    overflow: { top: true, left: true }
  },

  [JigsawPieceType.EDGE_1_B]: {
    scale: { x: 1, y: 1 },
    widgets: {}
  },
  [JigsawPieceType.EDGE_1_T]: {
    scale: { x: 1, y: -1 },
    widgets: {}
  },
  [JigsawPieceType.EDGE_1_L]: {
    scale: { x: 1, y: 1 },
    angle: -90,
    widgets: {}
  },
  [JigsawPieceType.EDGE_1_R]: {
    scale: { x: 1, y: 1 },
    angle: 90,
    widgets: {}
  },

  //--edge-2
  [JigsawPieceType.EDGE_2_B]: {
    scale: { x: 1, y: -1 },
    widgets: { bottom: true },
    overflow: { top: true }
  },
  [JigsawPieceType.EDGE_2_T]: {
    scale: { x: 1, y: 1 },
    widgets: { top: true },
    overflow: { bottom: true }
  },
  [JigsawPieceType.EDGE_2_L]: {
    scale: { x: 1, y: 1 },
    angle: 90,
    widgets: { left: true },
    overflow: { right: true }
  },
  [JigsawPieceType.EDGE_2_R]: {
    scale: { x: 1, y: 1 },
    angle: -90,
    widgets: { right: true },
    overflow: { left: true }
  },

  //--edge-3
  [JigsawPieceType.EDGE_3_B]: {
    scale: { x: 1, y: -1 },
    widgets: { bottom: true },
    overflow: { left: true, right: true }
  },
  [JigsawPieceType.EDGE_3_T]: {
    scale: { x: 1, y: 1 },
    widgets: { top: true },
    overflow: { left: true, right: true }
  },
  [JigsawPieceType.EDGE_3_L]: {
    scale: { x: 1, y: 1 },
    angle: 90,
    widgets: { left: true },
    overflow: { top: true, bottom: true }
  },
  [JigsawPieceType.EDGE_3_R]: {
    scale: { x: 1, y: 1 },
    angle: -90,
    widgets: { right: true },
    overflow: { top: true, bottom: true }
  },

  //--edge-4
  [JigsawPieceType.EDGE_4_B]: {
    scale: { x: 1, y: 1 },
    widgets: { bottom: true },
    overflow: { top: true }
  },
  [JigsawPieceType.EDGE_4_T]: {
    scale: { x: 1, y: -1 },
    widgets: { top: true },
    overflow: { bottom: true }
  },
  [JigsawPieceType.EDGE_4_L]: {
    scale: { x: 1, y: 1 },
    angle: -90,
    widgets: { left: true },
    overflow: { right: true }
  },
  [JigsawPieceType.EDGE_4_R]: {
    scale: { x: 1, y: 1 },
    angle: 90,
    widgets: { right: true },
    overflow: { left: true }
  },

  //--edge-5
  [JigsawPieceType.EDGE_5_B_1]: {
    scale: { x: 1, y: -1 },
    widgets: { bottom: true, right: true },
    overflow: { left: true, top: true }
  },
  [JigsawPieceType.EDGE_5_B_2]: {
    scale: { x: -1, y: -1 },
    angle: 0,
    widgets: { left: true, bottom: true },
    overflow: { right: true, top: true }
  },
  [JigsawPieceType.EDGE_5_T_1]: {
    scale: { x: 1, y: 1 },
    angle: 0,
    widgets: { right: true, top: true },
    overflow: { left: true, bottom: true }
  },
  [JigsawPieceType.EDGE_5_T_2]: {
    scale: { x: -1, y: 1 },
    widgets: { top: true, left: true },
    overflow: { bottom: true, right: true }
  },

  //--edge-5-2
  [JigsawPieceType.EDGE_5_R_1]: {
    scale: { x: -1, y: 1 },
    widgets: { top: true, right: true },
    overflow: { bottom: true, left: true },
    angle: 90
  },
  [JigsawPieceType.EDGE_5_R_2]: {
    scale: { x: -1, y: -1 },
    angle: 90,
    widgets: { right: true, bottom: true },
    overflow: { top: true, left: true }
  },
  [JigsawPieceType.EDGE_5_L_1]: {
    scale: { x: 1, y: 1 },
    angle: 90,
    widgets: { left: true, top: true },
    overflow: { right: true, bottom: true }
  },
  [JigsawPieceType.EDGE_5_L_2]: {
    scale: { x: 1, y: -1 },
    widgets: { bottom: true, left: true },
    overflow: { right: true, top: true },
    angle: 90
  },

  //--edge-6-1

  [JigsawPieceType.EDGE_6_T_1]: {
    scale: { x: 1, y: -1 },
    angle: 0,
    widgets: { right: true, top: true },
    overflow: { left: true }
  },
  [JigsawPieceType.EDGE_6_T_2]: {
    scale: { x: -1, y: -1 },
    widgets: { top: true, left: true },
    overflow: { right: true }
  },
  [JigsawPieceType.EDGE_6_B_1]: {
    scale: { x: 1, y: 1 },
    widgets: { bottom: true, right: true },
    overflow: { left: true }
  },
  [JigsawPieceType.EDGE_6_B_2]: {
    scale: { x: -1, y: 1 },
    angle: 0,
    widgets: { left: true, bottom: true },
    overflow: { right: true }
  },

  //--edge-6-2
  [JigsawPieceType.EDGE_6_R_1]: {
    scale: { x: 1, y: 1 },
    angle: 90,
    widgets: { top: true, right: true },
    overflow: { bottom: true }
  },
  [JigsawPieceType.EDGE_6_R_2]: {
    scale: { x: 1, y: -1 },
    angle: 90,
    widgets: { right: true, bottom: true },
    overflow: { top: true }
  },
  [JigsawPieceType.EDGE_6_L_1]: {
    scale: { x: -1, y: 1 },
    angle: 90,
    widgets: { left: true, top: true },
    overflow: { bottom: true }
  },
  [JigsawPieceType.EDGE_6_L_2]: {
    scale: { x: -1, y: -1 },
    angle: 90,
    widgets: { bottom: true, right: true },
    overflow: { top: true }
  },

  //--mid-1
  [JigsawPieceType.MID_1]: {
    scale: { x: 1, y: 1 },
    widgets: { top: true, left: true }
  },

  //--mid-2
  [JigsawPieceType.MID_2]: {
    scale: { x: 1, y: 1 },
    widgets: {},
    overflow: { top: true, bottom: true, left: true, right: true }
  },

  //-mid-3
  [JigsawPieceType.MID_3_T]: {
    scale: { x: 1, y: -1 },
    widgets: { top: true },
    overflow: { bottom: true, left: true, right: true }
  },
  [JigsawPieceType.MID_3_B]: {
    scale: { x: 1, y: 1 },
    widgets: { bottom: true },
    overflow: { top: true, left: true, right: true }
  },
  [JigsawPieceType.MID_3_L]: {
    scale: { x: 1, y: -1 },
    angle: -90,
    widgets: { left: true },
    overflow: { bottom: true, top: true, right: true }
  },
  [JigsawPieceType.MID_3_R]: {
    scale: { x: 1, y: -1 },
    angle: 90,
    widgets: { right: true },
    overflow: { bottom: true, left: true, top: true }
  },

  //-mid-4
  [JigsawPieceType.MID_4_T]: {
    scale: { x: 1, y: 1 },
    widgets: { top: true },
    overflow: { left: true, right: true }
  },
  [JigsawPieceType.MID_4_L]: {
    angle: 90,
    scale: { x: 1, y: 1 },
    widgets: { left: true },
    overflow: { top: true, bottom: true }
  },

  //-mid-5
  [JigsawPieceType.MID_5_TL]: {
    angle: 0,
    scale: {
      x: -1,
      y: 1
    },
    widgets: {
      top: true,
      left: true
    },
    overflow: { bottom: true, right: true }
  },
  [JigsawPieceType.MID_5_TR]: {
    scale: {
      x: 1,
      y: 1
    },
    widgets: {
      top: true,
      right: true
    },
    overflow: { bottom: true, left: true }
  },
  [JigsawPieceType.MID_5_BL]: {
    scale: {
      x: -1,
      y: -1
    },
    widgets: {
      bottom: true,
      left: true
    },
    overflow: { top: true, right: true }
  },
  [JigsawPieceType.MID_5_BR]: {
    scale: {
      x: 1,
      y: -1
    },
    widgets: {
      bottom: true,
      right: true
    },
    overflow: { top: true, left: true }
  },
  [JigsawPieceType.EMPTY]: {
    scale: {
      x: 0,
      y: 0
    },
    angle: 0,
    widgets: {
      top: false,
      bottom: false,
      right: false,
      left: false
    },
    overflow: {
      top: false,
      bottom: false,
      right: false,
      left: false
    }
  }
};
