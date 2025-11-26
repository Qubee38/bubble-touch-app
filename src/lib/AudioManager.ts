import { Howl } from 'howler';

// 音声ファイルのパス
const SOUND_PATHS = {
  pop1: '/assets/sounds/pop1.mp3',
  pop2: '/assets/sounds/pop2.mp3',
  tapLight: '/assets/sounds/tap-light.mp3',
  bgm: '/assets/sounds/bgm.mp3',
  great1: '/assets/sounds/encouragement/great1.mp3',
  great2: '/assets/sounds/encouragement/great2.mp3',
  great3: '/assets/sounds/encouragement/great3.mp3',
} as const;

class AudioManager {
  private sounds: Map<string, Howl> = new Map();
  private bgm: Howl | null = null;
  private volume: number = 0.7; // デフォルト音量
  private bgmEnabled: boolean = false;
  private soundFeedbackEnabled: boolean = true;
  private initialized: boolean = false; // 初期化フラグ

  constructor() {
    // 何もしない（音声ファイルがない場合のエラーを防ぐ）
  }

  // 音声ファイルをプリロード
  initialize() {
    if (this.initialized) {
      console.log('⚠️ AudioManager は既に初期化済みです');
      return; // 既に初期化済みなら何もしない
    }
    
    try {
      // 効果音をプリロード
      this.loadSound('pop1', SOUND_PATHS.pop1);
      this.loadSound('pop2', SOUND_PATHS.pop2);
      this.loadSound('tapLight', SOUND_PATHS.tapLight);
      this.loadSound('great1', SOUND_PATHS.great1);
      this.loadSound('great2', SOUND_PATHS.great2);
      this.loadSound('great3', SOUND_PATHS.great3);

      // BGM
      this.bgm = new Howl({
        src: [SOUND_PATHS.bgm],
        loop: true,
        volume: this.volume * 0.3, // BGMは小さめ
        onloaderror: () => {
          console.warn('BGMの読み込みに失敗しました');
        },
      });

      this.initialized = true; // 初期化完了フラグ
      console.log('✅ AudioManager 初期化完了');

      // BGMが有効な場合、初期化直後に再生開始
      if (this.bgmEnabled && this.bgm) {
        this.bgm.play();
        console.log('🎵 BGM 再生開始（初期化時）');
      }
    } catch (error) {
      console.warn('⚠️ 音声の初期化に失敗しました:', error);
    }
  }

  // 音声ファイルを読み込む
  private loadSound(key: string, src: string) {
    try {
      const sound = new Howl({
        src: [src],
        preload: true,
        volume: this.volume,
        onloaderror: () => {
          console.warn(`音声ファイルの読み込みに失敗: ${src}`);
        },
      });
      this.sounds.set(key, sound);
    } catch (error) {
      console.warn(`音声の読み込みエラー (${key}):`, error);
    }
  }

  // 効果音を再生
  play(key: string, volumeMultiplier: number = 1.0) {
    const sound = this.sounds.get(key);
    if (sound) {
      try {
        sound.volume(this.volume * volumeMultiplier);
        sound.play();
      } catch (error) {
        console.warn(`音声の再生エラー (${key}):`, error);
      }
    }
  }

  // 弾ける音を再生（ランダムにpop1かpop2）
  playPop() {
    const popSound = Math.random() > 0.5 ? 'pop1' : 'pop2';
    this.play(popSound);
  }

  // タップ音を再生（途中）
  playTapLight() {
    this.play('tapLight', 0.5); // 小さめの音量
  }

  // 音声フィードバックを再生（「すごい！」など）
  playEncouragement() {
    if (!this.soundFeedbackEnabled) return;

    // 30%の確率で再生
    if (Math.random() > 0.3) return;

    const sounds = ['great1', 'great2', 'great3'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    this.play(randomSound, 0.8);
  }

  // BGMを再生/停止
  toggleBGM(enabled: boolean) {
    this.bgmEnabled = enabled;
    
    if (!this.bgm) {
      console.warn('⚠️ BGMが初期化されていません');
      return;
    }

    if (enabled) {
      try {
        // 初期化済みの場合のみ再生
        if (this.initialized) {
          this.bgm.play();
          console.log('🎵 BGM 再生開始');
        } else {
          console.log('🎵 BGM 有効化（初回タッチ後に再生されます）');
        }
      } catch (error) {
        console.warn('BGMの再生エラー:', error);
      }
    } else {
      this.bgm.stop();
      console.log('🎵 BGM 停止');
    }
  }

  // 音声フィードバックの有効/無効
  setSoundFeedback(enabled: boolean) {
    this.soundFeedbackEnabled = enabled;
    console.log('音声フィードバック:', enabled ? 'ON' : 'OFF');
  }

  // 音量を設定（0.0 〜 1.0）
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume)); // 0〜1の範囲に制限
    
    // すべての効果音の音量を更新
    this.sounds.forEach((sound) => {
      sound.volume(this.volume);
    });

    // BGMの音量を更新
    if (this.bgm) {
      this.bgm.volume(this.volume * 0.3);
    }

    console.log('🔊 音量設定:', Math.round(this.volume * 100) + '%');
  }

  // 初期化済みかどうかを確認
  isInitialized(): boolean {
    return this.initialized;
  }

  // 現在の設定を取得
  getSettings() {
    return {
      volume: this.volume,
      bgmEnabled: this.bgmEnabled,
      soundFeedbackEnabled: this.soundFeedbackEnabled,
      initialized: this.initialized,
    };
  }
}

// シングルトンとしてエクスポート
export const audioManager = new AudioManager();