// シャボン玉の型定義
export interface Bubble {
  // 識別・位置
  id: number;           // 一意のID
  x: number;            // X座標
  y: number;            // Y座標
  radius: number;       // 半径

  // 動き
  speed: number;        // 上昇速度（px/フレーム）
  wobbleSpeed: number;  // 揺れの速度
  wobbleAmount: number; // 揺れの振幅（左右にどれくらい動くか）
  wobblePhase: number;  // 揺れの位相（現在の揺れの状態）

  // 見た目
  hue: number;          // 色相（0-360）
  opacity: number;      // 透明度（0-1）
  saturation: number;   // 彩度（0-100）
  brightness: number;   // 明るさ（0-100）
  glowIntensity: number; // 光沢の強さ（0-1）

  // タップ機能（Phase 4で使用）
  requiredTaps: number;   // 弾けるまでに必要なタップ数
  remainingTaps: number;  // 残りのタップ数
  currentTaps: number;    // 現在のタップ数

  // アニメーション状態（Phase 3で使用）
  isPopping: boolean;    // 弾けるアニメーション中か
  poppingProgress: number; // アニメーション進行度（0-1）
}

// パーティクルの型定義（新規追加）
export interface Particle {
  x: number;         // X座標
  y: number;         // Y座標
  vx: number;        // X方向の速度
  vy: number;        // Y方向の速度
  life: number;      // 残り寿命（1.0から減っていく）
  hue: number;       // 色相
  size: number;      // サイズ
}