import type { Bubble } from '../types/bubble';

// 2点間の距離を計算する関数
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy); // 三平方の定理
}

// タッチ位置とシャボン玉の衝突判定
export function checkCollision(
  touchX: number,
  touchY: number,
  bubble: Bubble
): boolean {
  const distance = getDistance(touchX, touchY, bubble.x, bubble.y);
  return distance < bubble.radius; // 距離が半径より小さければ衝突
}

// 複数のシャボン玉から、タッチしたものを見つける
export function findTouchedBubbles(
  touchX: number,
  touchY: number,
  bubbles: Bubble[]
): Bubble[] {
  return bubbles.filter((bubble) => {
    // 既に弾けているものは除外
    if (bubble.isPopping) return false;
    
    return checkCollision(touchX, touchY, bubble);
  });
}