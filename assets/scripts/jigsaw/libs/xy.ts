import { Node, UITransform, v3, Vec2, Vec3 } from 'cc';

/**
 * Convert touch point to position in node
 */
export function convertWorldToLocal(world: Vec2, node: Node): Vec3 {
  const local = node.getComponent(UITransform).convertToNodeSpaceAR(v3(world.x, world.y, 0));
  return local;
}

export function convertLocalToWorld(local: Vec2 | Vec3, node: Node): Vec3 {
  const world = node.getComponent(UITransform).convertToWorldSpaceAR(local as Vec3);
  return world;
}
