import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}: ModalProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-surface shadow-card-hover transition-all">
                <div className="flex items-center justify-between p-6 border-b border-surface-muted">
                  <Dialog.Title as="h3" className="text-lg font-display font-bold text-gray-dark">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray hover:text-gray-dark transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-dark">{message}</p>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-surface-muted">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    variant={variant}
                    size="sm"
                    onClick={handleConfirm}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {confirmText}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

