import { ref, type Ref } from 'vue';
import type { ApiError } from '@/lib/api';

export interface ErrorState {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

export function useErrorHandler() {
  const error: Ref<ErrorState | null> = ref(null);
  const isLoading = ref(false);

  const handleError = (err: unknown, context?: string) => {
    console.error(`Error in ${context}:`, err);

    let message = 'Une erreur inattendue est survenue';

    if (err && typeof err === 'object' && 'message' in err) {
      const apiError = err as ApiError;
      message = apiError.message;
    } else if (typeof err === 'string') {
      message = err;
    } else if (err instanceof Error) {
      message = err.message;
    }

    error.value = {
      message,
      type: 'error',
      timestamp: new Date(),
    };
  };

  const clearError = () => {
    error.value = null;
  };

  const showInfo = (message: string) => {
    error.value = {
      message,
      type: 'info',
      timestamp: new Date(),
    };
  };

  const showWarning = (message: string) => {
    error.value = {
      message,
      type: 'warning',
      timestamp: new Date(),
    };
  };

  const withLoading = async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    isLoading.value = true;
    clearError();

    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    error,
    isLoading,
    handleError,
    clearError,
    showInfo,
    showWarning,
    withLoading,
  };
}
