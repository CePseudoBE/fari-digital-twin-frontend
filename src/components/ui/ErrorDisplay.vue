<template>
  <Transition name="error-fade">
    <div
      v-if="error"
      :class="[
        'p-4 rounded-lg border flex items-center justify-between',
        errorClasses,
      ]"
      role="alert"
    >
      <div class="flex items-center gap-3">
        <div :class="iconClasses">
          <component :is="errorIcon" class="w-5 h-5" />
        </div>
        <div>
          <p class="font-medium text-sm">{{ error.message }}</p>
          <p v-if="showTimestamp" class="text-xs opacity-70 mt-1">
            {{ formattedTime }}
          </p>
        </div>
      </div>
      <button
        class="ml-4 p-1 rounded hover:bg-black/10 transition-colors"
        aria-label="Fermer"
        @click="$emit('close')"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next';
import type { ErrorState } from '@/composables/useErrorHandler';

interface Props {
  error: ErrorState | null;
  showTimestamp?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTimestamp: false,
});

defineEmits<{
  close: [];
}>();

const errorClasses = computed(() => {
  if (!props.error) return '';

  switch (props.error.type) {
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
});

const iconClasses = computed(() => {
  if (!props.error) return '';

  switch (props.error.type) {
    case 'error':
      return 'text-red-500';
    case 'warning':
      return 'text-yellow-500';
    case 'info':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
});

const errorIcon = computed(() => {
  if (!props.error) return Info;

  switch (props.error.type) {
    case 'error':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    default:
      return Info;
  }
});

const formattedTime = computed(() => {
  if (!props.error) return '';
  return props.error.timestamp.toLocaleTimeString();
});
</script>

<style scoped>
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
