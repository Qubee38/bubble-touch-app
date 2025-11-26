// 設定の型定義
export interface Settings {
  // 音声設定
  bgm: boolean;              // BGM有効/無効
  soundFeedback: boolean;    // 音声フィードバック（「すごい！」等）
  volume: number;            // 音量（0-1）
  
  // ゲーム設定
  maxTapsToPop: number;      // 最大タップ数（1-5）
  
  // 難易度設定
  bubbleSpeed: number;       // 上昇速度（1-5）
  bubbleSize: number;        // サイズ（1-5）
  spawnInterval: number;     // 生成間隔（ms）500-3000
  maxBubbles: number;        // 最大同時表示数（5-20）
}

// デフォルト設定
export const DEFAULT_SETTINGS: Settings = {
  bgm: false,
  soundFeedback: true,
  volume: 0.7,
  maxTapsToPop: 1,
  bubbleSpeed: 2,
  bubbleSize: 3,
  spawnInterval: 2000,
  maxBubbles: 10,
};

// localStorageのキー
export const STORAGE_KEY = 'bubble-app-settings';