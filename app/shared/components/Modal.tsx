'use client';

import { XMark } from '@/shared/icons';

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  menuRef: React.RefObject<HTMLDivElement | null> | null;
}

const Modal = ({ isOpen, onClose, children, menuRef }: IModal) => {
  if (!isOpen) { return null; }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={menuRef}
        className="h-auto max-h-[80%] w-[80%] overflow-y-auto overflow-x-hidden rounded-lg bg-white shadow-lg md:w-1/2"
      >
        <button
          onClick={onClose}
          className="sticky top-0 inline-flex w-full justify-end bg-white p-2 text-gray-500 hover:text-gray-700"
        >
          <XMark />
        </button>
        <div className="px-8 pb-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
