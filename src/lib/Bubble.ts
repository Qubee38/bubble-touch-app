import type { Bubble } from '../types/bubble';

// シャボン玉を生成する関数
export function createBubble(
  canvasWidth: number,
  canvasHeight: number,
  id: number,
  maxTaps: number = 1 // 最大タップ回数（デフォルト1）
): Bubble {
  const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const radius = random(30, 80);

  // 必要タップ回数をランダムに決定（1 〜 maxTaps）
  const requiredTaps = Math.floor(Math.random() * maxTaps) + 1;

  // タップ回数による視覚設定
  const visualConfig: Record<number, {
    opacity: number;
    saturation: number;
    brightness: number;
    glowIntensity: number;
  }> = {
    1: { opacity: 0.5, saturation: 50, brightness: 90, glowIntensity: 0.3 },
    2: { opacity: 0.7, saturation: 70, brightness: 75, glowIntensity: 0.6 },
    3: { opacity: 0.9, saturation: 85, brightness: 65, glowIntensity: 0.85 },
    4: { opacity: 0.95, saturation: 90, brightness: 60, glowIntensity: 0.9 },
    5: { opacity: 1.0, saturation: 95, brightness: 55, glowIntensity: 1.0 },
  };

  // requiredTaps に応じた設定を取得（なければ1の設定を使用）
  const visual = visualConfig[requiredTaps] || visualConfig[1];

  return {
    id,
    x: random(radius, canvasWidth - radius),
    y: canvasHeight + radius + 50,
    radius,
    speed: random(1, 3),
    wobbleSpeed: random(0.02, 0.05),
    wobbleAmount: random(1, 3),
    wobblePhase: random(0, Math.PI * 2),
    hue: random(0, 360),
    ...visual,
    requiredTaps,
    currentTaps: 0, // 初期は0回タップ
    isPopping: false,
    poppingProgress: 0,
  };
}

// シャボン玉の位置を更新する関数（変更なし）
export function updateBubble(bubble: Bubble): Bubble {
  if (bubble.isPopping) {
    return bubble;
  }

  const newY = bubble.y - bubble.speed;
  const newWobblePhase = bubble.wobblePhase + bubble.wobbleSpeed;
  const wobbleOffset = Math.sin(newWobblePhase) * bubble.wobbleAmount;
  const newX = bubble.x + wobbleOffset;

  return {
    ...bubble,
    y: newY,
    x: newX,
    wobblePhase: newWobblePhase,
  };
}

// シャボン玉が画面外に出たかチェックする関数（変更なし）
export function isBubbleOffScreen(bubble: Bubble): boolean {
  return bubble.y < -bubble.radius - 50;
}

// 【新規追加】シャボン玉をタップする関数
export function tapBubble(bubble: Bubble): Bubble {
  // 既に弾けている場合は何もしない
  if (bubble.isPopping) {
    return bubble;
  }

  // タップ回数を増やす
  const newCurrentTaps = bubble.currentTaps + 1;

  // 必要なタップ回数に達したか？
  if (newCurrentTaps >= bubble.requiredTaps) {
    // 弾ける！
    return {
      ...bubble,
      currentTaps: newCurrentTaps,
      isPopping: true,
      poppingProgress: 0,
    };
  } else {
    // まだ弾けない - 見た目を少し変える
    return {
      ...bubble,
      currentTaps: newCurrentTaps,
      opacity: bubble.opacity * 0.85, // 少し薄くする
    };
  }
}