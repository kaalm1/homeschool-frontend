import React from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';
import { Toast as ToastType, ToastType as ToastTypeEnum } from '../hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const icons: Record<ToastTypeEnum, React.ReactNode> = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
  };

  const bgColors: Record<ToastTypeEnum, string> = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 ${bgColors[toast.type]} animate-in slide-in-from-right shadow-lg duration-300`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <span className="font-medium">{toast.message}</span>
      </div>
      <button onClick={() => onClose(toast.id)} className="text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
