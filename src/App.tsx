import { useState, useEffect } from 'react';
import './App.css';
import BubbleCanvas from './components/BubbleCanvas';
import SettingsPanel from './components/SettingsPanel';
import SettingsButton from './components/SettingsButton';
import { audioManager } from './lib/AudioManager';
import type { Settings } from './types/settings';
import { saveSettings, loadSettings, resetSettings } from './utils/storage';

function App() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 設定の状態（localStorageから読み込み）
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  
  // 設定画面の表示状態
  const [showSettings, setShowSettings] = useState(false);

  // 画面サイズ変更の監視
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 設定が変更されたときの処理
  useEffect(() => {
    // 音声設定を適用
    audioManager.setVolume(settings.volume);
    audioManager.setSoundFeedback(settings.soundFeedback);

    // BGM設定を適用（初期化済みなら即座に、未初期化なら初期化後に）
    audioManager.toggleBGM(settings.bgm);

    // 設定を保存
    saveSettings(settings);

    console.log('⚙️ 設定を適用しました', settings);
  }, [settings]);

  // 設定を変更
  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  // 設定をリセット
  const handleReset = () => {
    const defaultSettings = resetSettings();
    setSettings(defaultSettings);
    console.log('✅ 設定をリセットしました');
  };

  return (
    <div className="App">
      {/* 設定ボタン */}
      <SettingsButton onOpen={() => setShowSettings(true)} />

      {/* Canvas */}
      <BubbleCanvas 
        width={dimensions.width} 
        height={dimensions.height}
        maxTapsToPop={settings.maxTapsToPop}
      />

      {/* 設定画面（モーダル） */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;