import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useOrientation() {
  const isPortrait = ref(false);
  const isMobile = ref(false);

  function checkOrientation() {
    isPortrait.value = window.innerHeight > window.innerWidth;
    isMobile.value = window.innerWidth < 768;
  }

  function handleResize() {
    checkOrientation();
  }

  onMounted(() => {
    checkOrientation();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  });

  const showOrientationWarning = computed(() => {
    return isPortrait.value && isMobile.value;
  });

  return {
    isPortrait,
    isMobile,
    showOrientationWarning,
    checkOrientation,
  };
}
