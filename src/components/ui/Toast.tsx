import { toast } from 'sonner';
import { toastMessages } from '../../constants/toastMessages';

// Generate the ToastKind type dynamically based on the keys of toastMessages
type ToastKind = keyof typeof toastMessages;

interface ToastOptions {
  // Define the properties of the options object here, if any
}

type ShowToastFunction = (
  type: 'success' | 'warning' | 'error' | 'info',
  kind: ToastKind,
  options?: ToastOptions,
) => void;

const showToast: ShowToastFunction = (type, kind, options = {}) => {
  const message = toastMessages[kind];
  if (message) {
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      default:
        console.warn(`Toast message of type "${type}" not found.`);
    }
  } else {
    console.warn(`Toast message of type "${type}" not found.`);
  }
};

export default showToast;
