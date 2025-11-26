import type { Particle } from '../types/bubble';

// パーティクルを生成する関数
export function createParticles(x: number, y: number, hue: number): Particle[] {
  const particles: Particle[] = [];
  const count = 10 + Math.floor(Math.random() * 10); // 10〜20個

  for (let i = 0; i < count; i++) {
    // 360度方向にランダムに飛び散る
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 2 + Math.random() * 3; // ランダムな速度

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed, // X方向の速度
      vy: Math.sin(angle) * speed, // Y方向の速度
      life: 1.0, // 寿命100%
      hue: hue + (Math.random() - 0.5) * 60, // 色相を少しずらす
      size: 2 + Math.random() * 3, // 2〜5px
    });
  }

  return particles;
}

// パーティクルを更新する関数
export function updateParticle(particle: Particle, deltaTime: number = 0.016): Particle {
  return {
    ...particle,
    x: particle.x + particle.vx,
    y: particle.y + particle.vy,
    vy: particle.vy + 0.2, // 重力を適用
    life: particle.life - deltaTime * 2, // 寿命を減らす（約0.5秒で消える）
  };
}

// パーティクルを描画する関数
export function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle) {
  ctx.save();
  ctx.globalAlpha = particle.life; // 寿命に応じて透明に
  ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}