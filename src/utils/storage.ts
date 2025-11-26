import type { Settings } from '../types/settings';
import { DEFAULT_SETTINGS, STORAGE_KEY } from '../types/settings';

// 設定をlocalStorageに保存
export function saveSettings(settings: Settings): void {
  try {
    const json = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEY, json);
    console.log('✅ 設定を保存しました');
  } catch (error) {
    console.error('設定の保存に失敗:', error);
  }
}

// 設定をlocalStorageから読み込み
export function loadSettings(): Settings {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      console.log('💡 保存された設定がありません（デフォルト設定を使用）');
      return DEFAULT_SETTINGS;
    }
    
    const settings = JSON.parse(json) as Settings;
    console.log('✅ 設定を読み込みました', settings);
    return settings;
  } catch (error) {
    console.error('設定の読み込みに失敗:', error);
    return DEFAULT_SETTINGS;
  }
}

// 設定をデフォルトに戻す
export function resetSettings(): Settings {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ 設定をリセットしました');
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('設定のリセットに失敗:', error);
    return DEFAULT_SETTINGS;
  }
}