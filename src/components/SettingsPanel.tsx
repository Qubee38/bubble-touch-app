import React from 'react';
import type { Settings } from '../types/settings';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onClose: () => void;
  onReset: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onClose,
  onReset,
}) => {
  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose} // 背景クリックで閉じる
    >
      <div 
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '20px',
          maxWidth: '400px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()} // コンテンツのクリックは伝播させない
      >
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '2px solid #e0e0e0',
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0 10px',
              color: '#333',
            }}
          >
            ←
          </button>
          <h2 style={{ 
            margin: 0, 
            fontSize: '20px',
            flex: 1,
            color: '#333',
          }}>
            せってい
          </h2>
        </div>

        {/* 音の設定 */}
        <Section title="🔊 音の設定">
          <ToggleItem
            label="BGM"
            checked={settings.bgm}
            onChange={(checked) => updateSetting('bgm', checked)}
          />
          <ToggleItem
            label="ほめことば"
            checked={settings.soundFeedback}
            onChange={(checked) => updateSetting('soundFeedback', checked)}
          />
          <SliderItem
            label="音量"
            value={settings.volume * 100}
            min={0}
            max={100}
            onChange={(value) => updateSetting('volume', value / 100)}
            unit="%"
          />
        </Section>

        {/* あそびかた */}
        <Section title="🎯 あそびかた">
          <SliderItem
            label="タップかいすう"
            value={settings.maxTapsToPop}
            min={1}
            max={5}
            onChange={(value) => updateSetting('maxTapsToPop', value)}
            unit="回"
          />
          <InfoBox>
            💡 「3回」を選ぶと、1〜3回のシャボン玉がランダムに出ます。
            色が濃いほど、たくさんタップが必要です。
          </InfoBox>
        </Section>

        {/* むずかしさ */}
        <Section title="⚙️ むずかしさ">
          <SliderItem
            label="はやさ（上がる速さ）"
            value={settings.bubbleSpeed}
            min={1}
            max={5}
            onChange={(value) => updateSetting('bubbleSpeed', value)}
          />
          <SliderItem
            label="おおきさ"
            value={settings.bubbleSize}
            min={1}
            max={5}
            onChange={(value) => updateSetting('bubbleSize', value)}
          />
        </Section>

        {/* リセットボタン */}
        <button
          onClick={onReset}
          style={{
            width: '100%',
            padding: '15px',
            background: '#f5f5f5',
            border: '2px solid #ddd',
            borderRadius: '10px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px',
            color: '#333',
          }}
        >
          デフォルトに戻す
        </button>
      </div>
    </div>
  );
};

// セクション
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: '25px' }}>
    <h3 style={{
      fontSize: '16px',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e0e0e0',
      color: '#333',
    }}>
      {title}
    </h3>
    {children}
  </div>
);

// トグルスイッチ
const ToggleItem: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  }}>
    <span style={{ fontSize: '16px', color: '#333' }}>{label}</span>
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '50px',
        height: '28px',
        borderRadius: '14px',
        background: checked ? '#4CAF50' : '#ccc',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s',
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'white',
        position: 'absolute',
        top: '2px',
        left: checked ? '24px' : '2px',
        transition: 'all 0.3s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  </div>
);

// スライダー
const SliderItem: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit?: string;
}> = ({ label, value, min, max, onChange, unit = '' }) => (
  <div style={{
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
    }}>
      <span style={{ fontSize: '16px', color: '#333' }}>{label}</span>
      <span style={{ color: '#2196F3', fontWeight: 'bold', fontSize: '16px' }}>
        {Math.round(value)}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        width: '100%',
        height: '8px',
        appearance: 'none',
        background: `linear-gradient(to right, #2196F3 0%, #2196F3 ${((value - min) / (max - min)) * 100}%, #e0e0e0 ${((value - min) / (max - min)) * 100}%, #e0e0e0 100%)`,
        borderRadius: '4px',
        outline: 'none',
        cursor: 'pointer',
      }}
    />
  </div>
);

// 情報ボックス
const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    padding: '10px',
    background: '#FFF9C4',
    borderRadius: '8px',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#333',
  }}>
    {children}
  </div>
);

export default SettingsPanel;