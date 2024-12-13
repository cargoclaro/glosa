"use client";

import { XMark } from "@/app/shared/icons";

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  menuRef: React.RefObject<HTMLDivElement> | null;
}

const Modal = ({ isOpen, onClose, children, menuRef }: IModal) => {
  if (!isOpen) return null;
  return (
    <div className="fixed flex items-center justify-center bg-black/50 inset-0 z-50">
      <div
        ref={menuRef}
        className="bg-white rounded-lg shadow-lg w-[80%] md:w-1/2 h-auto max-h-[80%] overflow-y-auto overflow-x-hidden"
      >
        <button
          onClick={onClose}
          className="bg-white sticky top-0 inline-flex w-full justify-end p-2 text-gray-500 hover:text-gray-700"
        >
          <XMark />
        </button>
        <div className="px-8 pb-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
