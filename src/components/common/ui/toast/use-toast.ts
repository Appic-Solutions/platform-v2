import { useToastContext } from './toast-provider';

export const useToast = () => {
  const { showToast, updateToast, removeToast } = useToastContext();
  return { showToast, updateToast, removeToast };
};
