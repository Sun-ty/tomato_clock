import { ref, onMounted, onUnmounted } from 'vue';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  '#7c3aed', '#f472b6', '#fbbf24', '#3b82f6', '#22c55e',
  '#ef4444', '#f97316', '#06b6d4', '#ec4899', '#a78bfa',
];

export function useCelebration() {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const isPlaying = ref(false);
  let ctx: CanvasRenderingContext2D | null = null;
  let particles: Particle[] = [];
  let animationId: number | null = null;

  function initCanvas() {
    if (!canvasRef.value) return;
    ctx = canvasRef.value.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvasRef.value) return;
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
  }

  function createParticles(count: number) {
    particles = [];
    const centerX = canvasRef.value ? canvasRef.value.width / 2 : window.innerWidth / 2;
    const centerY = canvasRef.value ? canvasRef.value.height / 2 : window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 4 + Math.random() * 6,
        life: 1,
        maxLife: 80 + Math.random() * 40,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  function animate() {
    if (!ctx || !canvasRef.value) return;

    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

    particles = particles.filter((p) => p.life > 0);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.15;
      particle.vx *= 0.99;
      particle.life -= 1 / particle.maxLife;
      particle.rotation += particle.rotationSpeed;

      const alpha = Math.max(0, particle.life);
      ctx!.save();
      ctx!.translate(particle.x, particle.y);
      ctx!.rotate(particle.rotation);
      ctx!.globalAlpha = alpha;
      ctx!.fillStyle = particle.color;
      ctx!.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.5);
      ctx!.restore();
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    } else {
      isPlaying.value = false;
    }
  }

  function play(particleCount = 80) {
    if (!canvasRef.value) return;
    isPlaying.value = true;
    createParticles(particleCount);
    animate();
  }

  function stop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    particles = [];
    isPlaying.value = false;
    if (ctx && canvasRef.value) {
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    }
  }

  onMounted(() => {
    initCanvas();
  });

  onUnmounted(() => {
    stop();
    window.removeEventListener('resize', resizeCanvas);
  });

  return {
    canvasRef,
    isPlaying,
    play,
    stop,
  };
}
