import { useRef, useEffect } from 'react';
import type { Bubble, Particle } from '../types/bubble';
import { createBubble, updateBubble, isBubbleOffScreen, tapBubble } from '../lib/Bubble';
import { findTouchedBubbles } from '../utils/collision';
import { createParticles, updateParticle, drawParticle } from '../utils/particles';
import { audioManager } from '../lib/AudioManager'; // 追加

interface BubbleCanvasProps {
  width: number;
  height: number;
  maxTapsToPop?: number;
}

const BubbleCanvas = ({ width, height, maxTapsToPop = 1 }: BubbleCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const bubblesRef = useRef<Bubble[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextIdRef = useRef<number>(1);
  const lastSpawnTimeRef = useRef<number>(Date.now());
  const audioInitializedRef = useRef<boolean>(false); // 音声初期化フラグ

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // タッチ/クリックイベントのハンドラ
    const handleTouch = (event: TouchEvent | MouseEvent) => {
      event.preventDefault();

      // 初回タッチ時に音声を初期化（ブラウザの制約対応）
      if (!audioInitializedRef.current) {
        audioManager.initialize();
        audioInitializedRef.current = true;
        console.log('🔊 AudioManager 初期化（初回タッチ）');
      }

      let touchX: number;
      let touchY: number;

      if (event instanceof TouchEvent) {
        const touch = event.touches[0] || event.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        touchX = touch.clientX - rect.left;
        touchY = touch.clientY - rect.top;
      } else {
        const rect = canvas.getBoundingClientRect();
        touchX = event.clientX - rect.left;
        touchY = event.clientY - rect.top;
      }

      const touched = findTouchedBubbles(touchX, touchY, bubblesRef.current);

      if (touched.length > 0) {
        bubblesRef.current = bubblesRef.current.map((bubble) => {
          const wasTouched = touched.some((t) => t.id === bubble.id);
          
          if (wasTouched) {
            const tappedBubble = tapBubble(bubble);
            
            // 弾けた場合
            if (tappedBubble.isPopping && !bubble.isPopping) {
              const newParticles = createParticles(
                tappedBubble.x,
                tappedBubble.y,
                tappedBubble.hue
              );
              particlesRef.current = [...particlesRef.current, ...newParticles];
              
              // 🔊 弾ける音を再生
              audioManager.playPop();
              
              // 🔊 音声フィードバック（30%の確率）
              audioManager.playEncouragement();
              
              console.log('💥 シャボン玉が弾けた!');
            } else {
              // タップ途中
              // 🔊 タップ音を再生
              audioManager.playTapLight();
              
              console.log('👆 タップ中...', {
                currentTaps: tappedBubble.currentTaps,
                requiredTaps: tappedBubble.requiredTaps,
              });
            }
            
            return tappedBubble;
          }
          
          return bubble;
        });
      }
    };

    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('mousedown', handleTouch);

    // ... drawBubble と animate は変更なし（省略）

    const drawBubble = (bubble: Bubble) => {
      // 前回と同じコード
      if (bubble.isPopping) {
        const scale = 1 + bubble.poppingProgress * 0.5;
        const alpha = 1 - bubble.poppingProgress;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(bubble.x, bubble.y);
        ctx.scale(scale, scale);
        ctx.translate(-bubble.x, -bubble.y);
      }

      const color = `hsl(${bubble.hue}, ${bubble.saturation}%, ${bubble.brightness}%)`;
      const gradient = ctx.createRadialGradient(
        bubble.x, bubble.y, 0,
        bubble.x, bubble.y, bubble.radius
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 0.9})`);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, `rgba(255, 255, 255, ${bubble.opacity * 0.3})`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();

      if (bubble.isPopping) {
        ctx.restore();
      } else {
        const highlightGradient = ctx.createRadialGradient(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          0,
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.4
        );
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.glowIntensity})`);
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.save();
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(
          bubble.x - bubble.radius * 0.3,
          bubble.y - bubble.radius * 0.3,
          bubble.radius * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();

        // タップ回数表示（デバック用）
        // if (bubble.requiredTaps > 1) {
        //   ctx.save();
        //   ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        //   ctx.font = 'bold 16px sans-serif';
        //   ctx.textAlign = 'center';
        //   ctx.textBaseline = 'middle';
        //   ctx.fillText(
        //     `${bubble.currentTaps}/${bubble.requiredTaps}`,
        //     bubble.x,
        //     bubble.y
        //   );
        //   ctx.restore();
        // }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const now = Date.now();

      if (now - lastSpawnTimeRef.current > 2000 && bubblesRef.current.length < 10) {
        const newBubble = createBubble(width, height, nextIdRef.current, maxTapsToPop);
        bubblesRef.current = [...bubblesRef.current, newBubble];
        nextIdRef.current += 1;
        lastSpawnTimeRef.current = now;
      }

      bubblesRef.current = bubblesRef.current.map((bubble) => {
        if (bubble.isPopping) {
          bubble.poppingProgress += 0.05;
          return bubble;
        } else {
          return updateBubble(bubble);
        }
      });

      bubblesRef.current = bubblesRef.current.filter((b) => {
        if (b.isPopping && b.poppingProgress >= 1) {
          return false;
        }
        return !isBubbleOffScreen(b);
      });

      particlesRef.current = particlesRef.current
        .map(updateParticle)
        .filter((p) => p.life > 0);

      bubblesRef.current.forEach(drawBubble);
      particlesRef.current.forEach((p) => drawParticle(ctx, p));

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('mousedown', handleTouch);
    };
  }, [width, height, maxTapsToPop]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: 'block',
        touchAction: 'none',
        cursor: 'pointer',
      }}
    />
  );
};

export default BubbleCanvas;