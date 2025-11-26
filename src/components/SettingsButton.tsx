import React, { useRef, useEffect } from 'react';

interface SettingsButtonProps {
  onOpen: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onOpen }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // 長押し開始
    const handleTouchStart = () => {
      pressTimerRef.current = window.setTimeout(() => {
        onOpen();
        console.log('⚙️ 設定画面を開きました（長押し）');
      }, 1000); // 1秒間長押し
    };

    // 長押しキャンセル
    const handleTouchEnd = () => {
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
    };

    button.addEventListener('touchstart', handleTouchStart);
    button.addEventListener('touchend', handleTouchEnd);
    button.addEventListener('touchcancel', handleTouchEnd);

    // PC用（クリック）
    button.addEventListener('click', onOpen);

    return () => {
      button.removeEventListener('touchstart', handleTouchStart);
      button.removeEventListener('touchend', handleTouchEnd);
      button.removeEventListener('touchcancel', handleTouchEnd);
      button.removeEventListener('click', onOpen);
      
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, [onOpen]);

  return (
    <button
      ref={buttonRef}
      style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      ⚙️
    </button>
  );
};

export default SettingsButton;