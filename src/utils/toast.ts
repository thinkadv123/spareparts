import { toast } from "sonner";

export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      direction: 'rtl',
      fontFamily: 'inherit'
    }
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    style: {
      direction: 'rtl',
      fontFamily: 'inherit'
    }
  });
};