<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { PartyPopper } from 'lucide-vue-next';

const props = defineProps<{
  show: boolean;
  type: 'pomodoro-complete' | 'break-start';
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
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
const particles = ref<Particle[]>([]);
const COLORS = [
  '#7c3aed', '#f472b6', '#fbbf24', '#3b82f6', '#22c55e',
  '#ef4444', '#f97316', '#06b6d4', '#ec4899', '#a78bfa',
];
function initCanvas() {
  if (!canvasRef.value) return;
  ctx = canvasRef.value.getContext('2d');
  resizeCanvas();
}
function resizeCanvas() {
  if (!canvasRef.value)
    return;
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
}
function createParticles(count: number) {
  const centerX = canvasRef.value ? canvasRef.value.width / 2 : window.innerWidth / 2;
  const centerY = canvasRef.value ? canvasRef.value.height / 2 : window.innerHeight / 2;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 3 + Math.random() * 5;
    particles.value.push({
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
  if (!ctx || !canvasRef.value)
    return;
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  particles.value = particles.value.filter((p) => p.life > 0);
  particles.value.forEach((particle) => {
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
  if (particles.value.length > 0) {
    animationId = requestAnimationFrame(animate);
  }
}
function play() {
  if (!canvasRef.value)
    return;
  createParticles(100);
  animate();
}
function stop() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  particles.value = [];
  if (ctx && canvasRef.value) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
}
watch(() => props.show, (newVal) => {
  if (newVal) {
    play();
  }
  else {
    stop();
  }
});
onMounted(() => {
  initCanvas();
  window.addEventListener('resize', resizeCanvas);
});
onUnmounted(() => {
  stop();
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-40 pointer-events-none">
      <canvas ref="canvasRef" class="absolute inset-0" />

      <div
        class="absolute inset-0 flex items-center justify-center animate-fade-in"
      >
        <div
          class="text-center bg-white/95 backdrop-blur-sm px-8 py-6 rounded-2xl shadow-2xl animate-scale-in"
        >
          <div class="mb-3">
            <PartyPopper
              class="w-12 h-12 mx-auto"
              :class="type === 'pomodoro-complete' ? 'text-primary-500' : 'text-green-500'"
            />
          </div>
          <h3 class="text-xl font-bold text-text-primary mb-1">
            {{ type === 'pomodoro-complete' ? '🎉 番茄钟完成！' : '☕ 休息时间' }}
          </h3>
          <p class="text-sm text-text-secondary">
            {{
              type === 'pomodoro-complete'
                ? '太棒了，继续保持！'
                : '放松一下，为下一个番茄钟做准备'
            }}
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
